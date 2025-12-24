
import React, { useEffect, useRef, useState } from 'react';

interface NLPVisualizerProps {
  objective: string;
  constraints?: string[];
  type: 'contour' | 'surface';
}

const NLPVisualizer: React.FC<NLPVisualizerProps> = ({ objective, constraints = [], type }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * 工业级数学公式标准化引擎
   * 能够将 (x-2)^2 -> (x-2)**2, 2y -> 2*y, xy -> x*y, sin(x)y -> Math.sin(x)*y
   */
  const cleanMathExpression = (expr: string) => {
    let s = expr.trim().toLowerCase();
    
    // 1. 去除 f(x,y)= 等前缀
    if (s.includes('=')) {
      const parts = s.split('=');
      s = parts[parts.length - 1];
    }

    // 2. 基础清理
    s = s.replace(/\s+/g, '')
         .replace(/\{/g, '(')
         .replace(/\}/g, ')')
         .replace(/\^/g, '**');

    // 3. 保护核心 Token (函数与常量)
    const mathMap: Record<string, string> = {
      'sin': 'Math.sin', 'cos': 'Math.cos', 'tan': 'Math.tan',
      'sqrt': 'Math.sqrt', 'exp': 'Math.exp', 'log': 'Math.log',
      'abs': 'Math.abs', 'atan': 'Math.atan', 'asin': 'Math.asin',
      'acos': 'Math.acos', 'max': 'Math.max', 'min': 'Math.min',
      'pi': 'Math.PI', 'e': 'Math.E'
    };

    const tokens: string[] = Object.keys(mathMap).sort((a, b) => b.length - a.length);
    const placeholders: string[] = [];
    
    tokens.forEach((token, i) => {
      const p = `__T${i}__`;
      placeholders.push(p);
      const regex = new RegExp(`\\b${token}\\b`, 'g');
      s = s.replace(regex, p);
    });

    // 保护变量
    s = s.replace(/\bx\b/g, '__X__').replace(/\by\b/g, '__Y__');

    // 4. 递归处理隐式乘法
    let last;
    do {
      last = s;
      s = s
        // 数字 + 变量/占位符/左括号
        .replace(/(\d)([a-z_])/g, '$1*$2')
        .replace(/(\d)\(/g, '$1*(')
        // 变量/占位符/右括号 + 数字
        .replace(/([a-z_])(\d)/g, '$1*$2')
        .replace(/\)(\d)/g, ')*$1')
        // 变量 + 左括号
        .replace(/(__[XY]__)\(/g, '$1*(')
        // 右括号 + 变量/左括号
        .replace(/\)([a-z_])/g, ')*$1')
        .replace(/\)\(/g, ')*(')
        // 变量/占位符之间 (排除函数名占位符紧跟括号的情况)
        .replace(/(__[XY]__)(__[XYT0-9_]+__)/g, '$1*$2')
        .replace(/(__T[0-9]+__)(__[XY]__)/g, '$1*$2');
    } while (s !== last);

    // 5. 还原 Token
    placeholders.forEach((p, i) => {
      s = s.replace(new RegExp(p, 'g'), mathMap[tokens[i]]);
    });
    s = s.replace(/__X__/g, 'x').replace(/__Y__/g, 'y');

    // 6. 解决 JS 幂运算优先级陷阱 (-x**2 语法错误)
    if (s.includes('**')) {
      s = s.replace(/(-)([a-z0-9\.x y\(\)Math\.\_]+)\*\*([a-z0-9\.x y\(\)Math\.\_]+)/g, (match, sign, base, exp) => {
        return `-(${base}**${exp})`;
      });
    }

    return s;
  };

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;

    const draw = async () => {
      const container = containerRef.current;
      if (!container || !isMounted) return;

      const Plotly = (window as any).Plotly;
      if (!Plotly) {
        if (retryCount < 60) {
          retryCount++;
          setTimeout(draw, 100);
        }
        return;
      }

      // 确保容器有尺寸
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        requestAnimationFrame(draw);
        return;
      }

      try {
        setError(null);
        const jsObjective = cleanMathExpression(objective);
        
        let objectiveFn;
        try {
          objectiveFn = new Function('x', 'y', `
            try {
              const v = ${jsObjective};
              return (isNaN(v) || !isFinite(v)) ? 0 : v;
            } catch(e) { return 0; }
          `);
          objectiveFn(0, 0); // 预检
        } catch (e) {
          throw new Error("表达式语法错误，请检查括号与变量名称。");
        }

        const constraintCheckers = constraints
          .filter(c => c.trim() !== '')
          .map(c => {
            const expr = c.toLowerCase();
            const ops = ['<=', '>=', '='];
            const op = ops.find(o => expr.includes(o)) || '';
            if (!op) return null;
            const [l, r] = expr.split(op);
            const lJS = cleanMathExpression(l);
            const rJS = cleanMathExpression(r || '0');
            const lFn = new Function('x', 'y', `return ${lJS}`);
            const rFn = new Function('x', 'y', `return ${rJS}`);
            return (x: number, y: number) => {
              try {
                const lv = lFn(x, y), rv = rFn(x, y);
                if (op === '<=') return lv <= rv;
                if (op === '>=') return lv >= rv;
                if (op === '=') return Math.abs(lv - rv) < 0.05;
                return true;
              } catch (e) { return true; }
            };
          }).filter(fn => fn !== null) as Array<(x: number, y: number) => boolean>;

        const xData: number[] = [], yData: number[] = [], zData: number[][] = [], maskData: (number | null)[][] = [];
        const range = 5, res = type === 'surface' ? 40 : 60, step = (range * 2) / res;

        for (let i = -range; i <= range; i += step) xData.push(Number(i.toFixed(3)));
        for (let j = -range; j <= range; j += step) yData.push(Number(j.toFixed(3)));

        for (let yv of yData) {
          const zRow: number[] = [], mRow: (number | null)[] = [];
          for (let xv of xData) {
            zRow.push(objectiveFn(xv, yv));
            mRow.push(constraintCheckers.every(chk => chk(xv, yv)) ? null : 1);
          }
          zData.push(zRow);
          maskData.push(mRow);
        }

        const data: any[] = [];
        if (type === 'contour') {
          data.push({
            z: zData, x: xData, y: yData, type: 'contour', colorscale: 'Portland',
            contours: { coloring: 'heatmap', showlabels: true }
          });
          data.push({
            z: maskData, x: xData, y: yData, type: 'heatmap',
            colorscale: [[0, 'rgba(0,0,0,0)'], [1, 'rgba(15,23,42,0.8)']],
            showscale: false, hoverinfo: 'skip'
          });
        } else {
          data.push({
            z: zData, x: xData, y: yData, type: 'surface', colorscale: 'Viridis',
            lighting: { ambient: 0.6, diffuse: 0.8, roughness: 0.2, specular: 0.5 },
            contours: { z: { show: true, usecolormap: true, project: { z: true } } }
          });
        }

        // 关键修复：确保 layout 对象结构对于 3D 渲染是完整且稳健的
        const layout: any = {
          autosize: true,
          margin: { l: 0, r: 0, b: 0, t: 0 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { family: 'Inter, sans-serif' },
          showlegend: false
        };

        if (type === 'surface') {
          layout.scene = {
            xaxis: { title: 'X', gridcolor: '#e2e8f0' },
            yaxis: { title: 'Y', gridcolor: '#e2e8f0' },
            zaxis: { title: 'f(x,y)', gridcolor: '#e2e8f0' },
            camera: {
              up: { x: 0, y: 0, z: 1 },
              center: { x: 0, y: 0, z: 0 },
              eye: { x: 1.5, y: 1.5, z: 1.2 }
            },
            aspectmode: 'manual',
            aspectratio: { x: 1, y: 1, z: 0.7 }
          };
        } else {
          layout.xaxis = { title: 'X', gridcolor: '#f1f5f9' };
          layout.yaxis = { title: 'Y', gridcolor: '#f1f5f9' };
        }

        Plotly.react(container, data, layout, { responsive: true, displayModeBar: false });

      } catch (err: any) {
        console.error("Plotly Setup Error:", err);
        setError(err.message || "数学解析引擎异常。");
      }
    };

    const timer = setTimeout(draw, 100);
    const observer = new ResizeObserver(() => { if (isMounted) draw(); });
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [objective, constraints, type]);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center relative bg-slate-50/50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner">
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-md p-10 text-center animate-in fade-in duration-300">
          <div className="max-w-sm bg-red-50 border border-red-100 p-8 rounded-[3rem] shadow-2xl">
            <div className="w-16 h-16 bg-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
              <span className="text-white text-3xl font-black">!</span>
            </div>
            <h4 className="text-red-900 font-black text-lg mb-3">数学转换引擎报告</h4>
            <p className="text-red-700 text-xs font-bold leading-relaxed mb-6">{error}</p>
            <div className="text-[10px] text-red-400 font-black uppercase tracking-[3px] border-t border-red-100 pt-5">
              提示：输入 (x-2)^2 + 2y 系统将自动处理
            </div>
          </div>
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-full transition-all duration-1000" 
        style={{ 
          opacity: error ? 0 : 1,
          filter: error ? 'blur(20px) grayscale(1)' : 'none'
        }} 
      />
    </div>
  );
};

export default NLPVisualizer;
