import { Briefcase, MapPin, GraduationCap, Clock } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    title: "测试开发工程师",
    salary: "15-25K",
    company: "字节跳动",
    area: "北京·海淀区",
    experience: "3-5年",
    degree: "本科",
    tags: ["自动化测试", "Python", "Java", "CI/CD"],
    hrName: "张女士",
    hrTitle: "HRBP",
  },
  {
    id: 2,
    title: "高级软件测试工程师",
    salary: "12-20K",
    company: "腾讯",
    area: "深圳·南山区",
    experience: "1-3年",
    degree: "本科",
    tags: ["接口测试", "性能测试", "JMeter", "MySQL"],
    hrName: "李先生",
    hrTitle: "招聘专家",
  },
  {
    id: 3,
    title: "自动化测试工程师",
    salary: "14-22K",
    company: "美团",
    area: "北京·朝阳区",
    experience: "3-5年",
    degree: "本科",
    tags: ["Playwright", "Selenium", "自动化框架设计"],
    hrName: "王女士",
    hrTitle: "技术主管",
  },
  {
    id: 4,
    title: "服务端测试开发",
    salary: "18-30K",
    company: "阿里巴巴",
    area: "杭州·余杭区",
    experience: "5-10年",
    degree: "统招本科",
    tags: ["Golang", "微服务", "架构设计", "白盒测试"],
    hrName: "赵先生",
    hrTitle: "高级招聘专员",
  },
  {
    id: 5,
    title: "游戏测试工程师",
    salary: "10-16K",
    company: "网易游戏",
    area: "广州·天河区",
    experience: "1-3年",
    degree: "大专及以上",
    tags: ["黑盒测试", "游戏引擎", "专项测试"],
    hrName: "陈女士",
    hrTitle: "HR",
  },
];

export default function JobsPage() {
  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-sky-100 p-2.5 rounded-2xl text-sky-600 shadow-sm">
          <Briefcase size={28} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">招聘信息 (模拟)</h1>
          <p className="text-sm text-slate-500 mt-1">了解市场行情，明确学习目标方向</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {mockJobs.map((job) => (
          <div key={job.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-sky-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-sky-600 transition-colors">{job.title}</h3>
              <span className="text-sky-500 font-bold">{job.salary}</span>
            </div>
            <div className="flex gap-4 text-sm text-slate-500 mb-4">
              <span className="flex items-center gap-1"><MapPin size={14} />{job.area}</span>
              <span className="flex items-center gap-1"><Clock size={14} />{job.experience}</span>
              <span className="flex items-center gap-1"><GraduationCap size={14} />{job.degree}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag, idx) => (
                <span key={idx} className="bg-slate-50 text-slate-500 text-xs px-2.5 py-1 rounded border border-slate-100">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-200 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
                  {job.hrName[0]}
                </div>
                <div className="text-sm">
                  <span className="text-slate-700 font-medium">{job.hrName}</span>
                  <span className="text-slate-400 mx-1">·</span>
                  <span className="text-slate-500">{job.hrTitle}</span>
                </div>
              </div>
              <div className="text-sm text-slate-600 font-medium">{job.company}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
