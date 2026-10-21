import { Reveal } from '../Reveal';
import { CopyButton } from './Sections';
import typeCase from '../../assets/metal-movable-type.jpg';
import composingStick from '../../assets/thai-movable-type-on-composing-stick-bangkok.jpg';

const DOCS = [
  {
    group: '命令行',
    rows: [
      { name: 'CLI 用法与内存调优', val: 'docs/USAGE.md', href: 'https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md' },
      { name: '发布说明', val: 'docs/STATUS.md', href: 'https://github.com/oxc-project/tsrs/blob/main/docs/STATUS.md' },
    ],
  },
  {
    group: '编辑器与 API',
    rows: [
      { name: '编辑器配置', val: 'docs/LSP.md', href: 'https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md#editor-setup' },
      { name: 'Node API', sub: '接口仍在变动', val: 'docs/NODE_API.md', href: 'https://github.com/oxc-project/tsrs/blob/main/docs/NODE_API.md' },
      { name: 'WebAssembly', sub: 'Node 与浏览器，wasm32-wasip1', val: '@tsrs/wasm', href: 'https://github.com/oxc-project/tsrs/blob/main/npm/tsrs-wasm/README.md' },
    ],
  },
  {
    group: '研究与证据',
    rows: [
      { name: '基准测试与方法论', val: 'bench/README.md', href: 'https://github.com/oxc-project/tsrs/blob/main/bench/README.md' },
      { name: '工程笔记', val: 'notes/README.md', href: 'https://github.com/oxc-project/tsrs/blob/main/notes/README.md' },
      { name: '兼容性与证据', val: 'COMPATIBILITY.md', href: 'https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md' },
    ],
  },
  {
    group: '参与',
    rows: [
      { name: 'issue 追踪器', sub: '附一个最小可复现示例', val: 'github.com/oxc-project/tsrs', href: 'https://github.com/oxc-project/tsrs/issues' },
      { name: '贡献指南', sub: '从源码构建、跑测试套件', val: 'CONTRIBUTING.md', href: 'https://github.com/oxc-project/tsrs/blob/main/CONTRIBUTING.md' },
      { name: '行为准则', val: 'CODE_OF_CONDUCT.md', href: 'https://github.com/oxc-project/tsrs/blob/main/CODE_OF_CONDUCT.md' },
      { name: '安全策略', sub: '报告漏洞走这条线', val: 'SECURITY.md', href: 'https://github.com/oxc-project/tsrs/blob/main/SECURITY.md' },
      { name: '浏览器 playground', sub: '不装也能检查、也能生成代码', val: 'tsrs-playground.void.app', href: 'https://tsrs-playground.void.app' },
    ],
  },
];

export function Docs() {
  return (
    <Reveal as="section" className="sec wrap" id="docs">
      <div className="docs">
        <h2 className="h2">文档与入口</h2>
        {DOCS.map((g) => (
          <div className="group" key={g.group}>
            <p className="glabel">{g.group}</p>
            {g.rows.map((r) => (
              <a key={r.name} href={r.href} rel="noreferrer" target="_blank">
                <span>
                  {r.name}
                  {r.sub && <span className="sub2">{r.sub}</span>}
                </span>
                <span className="val">{r.val}</span>
              </a>
            ))}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export function Plate() {
  return (
    <Reveal as="section" className="sec wrap" id="port">
      <div className="plate-text">
        <h2 className="h2">
          <span className="soft">同一副字义，</span>
          <br />
          另一副字模。
        </h2>
        <div>
          <p className="prose">
            移植不是重写。同一份语义，换一副模子重新排一遍，印出来还得是同一页字。tsrs
            把 TypeScript 的实现逐条搬进 Rust，再用同一批诊断去校对：哪一行输出的字符不一样，就是哪里还没搬完。
          </p>
          <p className="note" style={{ marginTop: '14px' }}>
            整体移植由 Max Schwenk 完成；@walkerdb 与 @JiangWeixian 之后做了改进，其中 @JiangWeixian 转让了 tsrs
            这个 npm 包名。TypeScript 团队提供了全程支持。
          </p>
        </div>
      </div>

      <div className="plate">
        <figure>
          <img
            className="tall drift"
            src={typeCase}
            width={1080}
            height={810}
            alt="排字工的活字盘：木格子里按字母分装着金属活字，一把字盘上夹着已排好的一行字"
            loading="lazy"
          />
          <figcaption>字盘：同一批字，按格归位。Willi Heidelbach 摄，CC BY 2.5</figcaption>
        </figure>
        <figure>
          <img
            className="short"
            src={composingStick}
            width={1080}
            height={972}
            alt="一把排字手盘，里面反着排了一行泰文金属活字"
            loading="lazy"
          />
          <figcaption>排字手盘：字要反着排，印出来才是正的。Paul_012 摄，CC BY-SA 4.0</figcaption>
        </figure>
      </div>
    </Reveal>
  );
}

export function Credits() {
  return (
    <Reveal as="section" className="sec wrap">
      <div className="credits">
        <p className="intro-line">赞助与致谢</p>
        <div className="names">
          <span>Depot CI</span>
          <span>Owner.com</span>
          <span>Max Schwenk</span>
          <span>@walkerdb</span>
          <span>@JiangWeixian</span>
          <span>TypeScript 团队</span>
        </div>
      </div>
      <p className="note" style={{ marginTop: '20px', maxWidth: '58ch' }}>
        Depot 为持续集成提供机器，基准测试就跑在上面；Owner.com 赞助了项目的初期工作。我们不收 Pull
        Request——没有足够精力审查，但 issue 是开的。
      </p>
    </Reveal>
  );
}

export function FinalCta() {
  return (
    <Reveal as="section" className="cta" id="install">
      <div className="wrap">
        <div className="cta-grid">
          <h2>
            先跑一遍，
            <br />
            再决定。
          </h2>
          <div>
            <div className="cmds">
              <div className="cmd">
                <code>pnpm add -D tsrs</code>
                <CopyButton text="pnpm add -D tsrs" />
              </div>
              <div className="cmd">
                <code>pnpm exec tsrs --noEmit</code>
                <CopyButton text="pnpm exec tsrs --noEmit" />
              </div>
            </div>
            <p className="after">
              不想装也行，
              <a className="link" href="https://tsrs-playground.void.app" rel="noreferrer" target="_blank">
                浏览器 playground
              </a>{' '}
              里可以直接检查并生成代码。没有预编译二进制的平台，用 <b>@tsrs/wasm</b>（wasm32-wasip1）。
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Foot() {
  return (
    <footer className="foot">
      <div className="tile tile--state">
        <span className="tl">许可证</span>
        <p>
          tsrs 是 TypeScript（版权归 Microsoft Corporation 所有）的衍生品，基于 Apache-2.0 发布。随附的{' '}
          <code className="inline-code">lib.*.d.ts</code> 来自 TypeScript，署名见 NOTICE。本项目与 Microsoft
          无隶属关系，也未获其背书。
        </p>
      </div>
      <div className="tile tile--nav">
        <span className="tl">页面</span>
        <a className="link" href="#consistency">
          一致性
        </a>
        <a className="link" href="#bench">
          基准
        </a>
        <a className="link" href="#docs">
          文档
        </a>
        <a className="link" href="#watch">
          增量编辑
        </a>
      </div>
      <div className="tile tile--meta">
        <span className="tl">版本</span>
        <p className="num">0.18.0</p>
        <p className="num">ts7.1.0-dev</p>
        <p className="note">2026-10-21 查于 npm</p>
        <p className="note">本站的类型检查也由它完成</p>
      </div>
      <div className="tile tile--mail">
        <span className="tl">反馈</span>
        <p>附一个最小复现，比描述一百句有用。</p>
        <a href="https://github.com/oxc-project/tsrs/issues" rel="noreferrer" target="_blank">
          issues →
        </a>
      </div>
      <div className="tile tile--mark">
        <span className="big">tsrs</span>
      </div>
      <a className="tile tile--accent" href="https://github.com/oxc-project/tsrs/issues" rel="noreferrer" target="_blank">
        <span className="inv">
          报 bug，
          <br />
          不发 PR。
        </span>
        <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="4">
          <path d="M10 34 L34 10" />
          <path d="M16 10 H34 V28" />
        </svg>
      </a>
    </footer>
  );
}
