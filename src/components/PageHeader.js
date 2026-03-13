const PageHeader = ({name})=>{
    return(
        <header className="bg-slate-800 border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">{name}</h1>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] tracking-[0.15em] text-white uppercase">Today&apos;s Goal</p>
              <p className="text-sm font-semibold text-indigo-300">Module Completion</p>
            </div>
            {/* <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button> */}
          </div>
        </header>
    )
}

export default PageHeader