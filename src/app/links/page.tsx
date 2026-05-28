"use client";
import { Compass, ExternalLink } from "lucide-react";

const learningLinks = [
  {
    title: "GitHub",
    desc: "全球最大的开源代码托管平台，发现优秀开源测试框架",
    url: "https://github.com/",
    icon: "https://github.githubassets.com/favicons/favicon.svg"
  },
  {
    title: "软考官网",
    desc: "中国计算机技术职业资格网，软件评测师考试报名与查询",
    url: "https://www.ruankao.org.cn/",
    icon: "https://www.ruankao.org.cn/favicon.ico"
  },
  {
    title: "力扣 (LeetCode)",
    desc: "海量技术面试题库，测试开发必刷算法题",
    url: "https://leetcode.cn/",
    icon: "https://static.leetcode.cn/front-end/v4/static/favicon.ico"
  },
  {
    title: "牛客网",
    desc: "求职笔试面试求职神器，大量名企测试真题面经",
    url: "https://www.nowcoder.com/",
    icon: "https://static.nowcoder.com/images/logo_87_87.png"
  },
  {
    title: "稀土掘金",
    desc: "优质的开发者社区，搜寻前沿测试技术和实战踩坑",
    url: "https://juejin.cn/",
    icon: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png"
  },
  {
    title: "TesterHome",
    desc: "中国领先的测试开发技术社区",
    url: "https://testerhome.com/",
    icon: "https://testerhome.com/favicon.ico"
  }
];

export default function LinksPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-sky-100 p-2.5 rounded-2xl text-sky-600 shadow-sm">
          <Compass size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">学习导航</h1>
          <p className="text-sm text-slate-500 mt-1">精选测试相关的优质资源站点，一键直达</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {learningLinks.map((link, idx) => (
          <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="block bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-1 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={link.icon} alt={link.title} className="w-8 h-8 object-contain rounded-md bg-white p-0.5 border border-slate-100" onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }} />
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{link.title}</h3>
              </div>
              <ExternalLink size={18} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
            </div>
            <p className="text-sm text-slate-500 line-clamp-2">{link.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
