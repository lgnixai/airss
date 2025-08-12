import{R as s,I as x}from"./index-Cz3doEcl.js";import"./react-vendor-Bs7gn1Hv.js";import"./monaco-vendor-Dv-Uvxl1.js";var d=(l=>(l.REGISTERED="registered",l.ENABLED="enabled",l.DISABLED="disabled",l.ERROR="error",l))(d||{});let v=class{events={};on(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)}off(e,t){if(!this.events[e])return;const i=this.events[e].indexOf(t);i>-1&&this.events[e].splice(i,1)}emit(e,...t){this.events[e]&&this.events[e].forEach(i=>{try{i(...t)}catch(n){console.error("Event listener error:",n)}})}};class f extends v{plugins=new Map;pluginAPIs=new Map;enabledPlugins=new Set;pluginSettings=new Map;moleculeContext;constructor(e){super(),this.moleculeContext=e}async registerPlugin(e,t){const i=e.id;if(this.plugins.has(i))throw new Error(`Plugin ${i} is already registered`);const n={id:i,name:e.name,version:e.version,description:e.description,author:e.author,dependencies:e.dependencies||[],status:d.REGISTERED,manifest:e,instance:null,api:null};this.plugins.set(i,n),this.emit("pluginRegistered",n)}async enablePlugin(e){const t=this.plugins.get(e);if(!t)throw new Error(`Plugin ${e} not found`);if(!this.enabledPlugins.has(e)){await this.checkDependencies(t);try{const i=t.manifest.pluginClass,n=new i,o=this.createPluginAPI(e);n.onload&&await n.onload(o),t.instance=n,t.api=o,t.status=d.ENABLED,this.enabledPlugins.add(e),this.emit("pluginEnabled",t)}catch(i){throw t.status=d.ERROR,this.emit("pluginError",t,i),i}}}async disablePlugin(e){const t=this.plugins.get(e);if(!(!t||!this.enabledPlugins.has(e)))try{t.instance&&t.instance.onunload&&await t.instance.onunload(),t.instance=null,t.api=null,t.status=d.REGISTERED,this.enabledPlugins.delete(e),this.emit("pluginDisabled",t)}catch(i){throw this.emit("pluginError",t,i),i}}createPluginAPI(e){const t={fileSystem:{readFile:i=>this.readFile(i),writeFile:(i,n)=>this.writeFile(i,n),deleteFile:i=>this.deleteFile(i),listFiles:i=>this.listFiles(i),createFolder:i=>this.createFolder(i)},ui:{addRibbonIcon:(i,n,o)=>this.addRibbonIcon(e,i,n,o),addStatusBarItem:i=>this.addStatusBarItem(e,i),addSettingTab:i=>this.addSettingTab(e,i),registerView:(i,n)=>this.registerView(e,i,n),addActivityBarItem:i=>this.addActivityBarItem(e,i),addSidebarItem:i=>this.addSidebarItem(e,i),setAuxiliaryBar:i=>this.setAuxiliaryBar(i),addAuxiliaryBarItem:i=>this.addAuxiliaryBarItem(i),setCurrentAuxiliaryBar:i=>this.setCurrentAuxiliaryBar(i)},events:{on:(i,n)=>this.on(i,n),off:(i,n)=>this.off(i,n),emit:(i,...n)=>this.emit(i,...n)},settings:{get:(i,n)=>this.getSetting(e,i,n),set:(i,n)=>this.setSetting(e,i,n),getAll:()=>this.getAllSettings(e)},ai:{chat:i=>this.aiChat(i),summarize:i=>this.aiSummarize(i),translate:(i,n)=>this.aiTranslate(i,n)},utils:{debounce:(i,n)=>this.debounce(i,n),throttle:(i,n)=>this.throttle(i,n),generateId:()=>this.generateId()},molecule:this.moleculeContext};return this.pluginAPIs.set(e,t),t}async checkDependencies(e){for(const t of e.dependencies)if(!this.enabledPlugins.has(t))throw new Error(`Plugin ${e.id} depends on ${t} which is not enabled`)}async readFile(e){return""}async writeFile(e,t){}async deleteFile(e){}async listFiles(e){return[]}async createFolder(e){}addRibbonIcon(e,t,i,n){}addStatusBarItem(e,t){}addSettingTab(e,t){}registerView(e,t,i){}addActivityBarItem(e,t){console.log("Adding activity bar item:",t),this.moleculeContext&&this.moleculeContext.activityBar&&this.moleculeContext.activityBar.add({id:t.id,name:t.name,icon:t.icon,sortIndex:t.sortIndex,alignment:t.alignment||"top",onClick:t.onClick})}addSidebarItem(e,t){console.log("Adding sidebar item:",t),this.moleculeContext&&this.moleculeContext.sidebar&&this.moleculeContext.sidebar.add({id:t.id,name:t.name,render:t.render})}setAuxiliaryBar(e){console.log(`Setting auxiliary bar visibility: ${e}`),this.moleculeContext&&this.moleculeContext.layout&&this.moleculeContext.layout.setAuxiliaryBar(e)}addAuxiliaryBarItem(e){console.log("Adding auxiliary bar item:",e),this.moleculeContext&&this.moleculeContext.auxiliaryBar&&this.moleculeContext.auxiliaryBar.add({id:e.id,name:e.name,icon:e.icon,render:e.render})}setCurrentAuxiliaryBar(e){console.log(`Setting current auxiliary bar: ${e}`),this.moleculeContext&&this.moleculeContext.auxiliaryBar&&this.moleculeContext.auxiliaryBar.setCurrent(e)}getSetting(e,t,i){const n=this.pluginSettings.get(e)||{};return n[t]!==void 0?n[t]:i}setSetting(e,t,i){const n=this.pluginSettings.get(e)||{};n[t]=i,this.pluginSettings.set(e,n)}getAllSettings(e){return this.pluginSettings.get(e)||{}}async aiChat(e){return""}async aiSummarize(e){return""}async aiTranslate(e,t){return""}debounce(e,t){let i;return function(...o){const a=()=>{clearTimeout(i),e(...o)};clearTimeout(i),i=setTimeout(a,t)}}throttle(e,t){let i;return function(...o){i||(e.apply(this,o),i=!0,setTimeout(()=>i=!1,t))}}generateId(){return Math.random().toString(36).substr(2,9)}getAllPlugins(){return Array.from(this.plugins.values())}getEnabledPlugins(){return Array.from(this.enabledPlugins).map(e=>this.plugins.get(e))}getPluginStatus(e){return this.plugins.get(e)?.status}getPlugin(e){return this.plugins.get(e)}}class y{events={};on(e,t){this.events[e]||(this.events[e]=[]),this.events[e].push(t)}off(e,t){if(!this.events[e])return;const i=this.events[e].indexOf(t);i>-1&&this.events[e].splice(i,1)}emit(e,...t){this.events[e]&&this.events[e].forEach(i=>{try{i(...t)}catch(n){console.error("Event listener error:",n)}})}}class w extends y{registeredEvents=[];registeredIntervals=[];registerEvent(e){this.registeredEvents.push(e)}registerDomEvent(e,t,i){const n=i;e.addEventListener(t,n),this.registeredEvents.push({element:e,type:t,listener:n})}registerInterval(e){this.registeredIntervals.push(e)}dispose(){this.registeredEvents.forEach(({element:e,type:t,listener:i})=>{e.removeEventListener(t,i)}),this.registeredEvents=[],this.registeredIntervals.forEach(e=>clearInterval(e)),this.registeredIntervals=[],this.events={}}}HTMLElement.prototype.setText=function(l){this.textContent=l};HTMLElement.prototype.empty=function(){this.innerHTML=""};HTMLElement.prototype.createDiv=function(l){const e=document.createElement("div");return l?.cls&&(e.className=l.cls),l?.text&&(e.textContent=l.text),this.appendChild(e),e};HTMLElement.prototype.createEl=function(l,e){const t=document.createElement(l);return e?.cls&&(t.className=e.cls),e?.text&&(t.textContent=e.text),e?.type&&(t.type=e.type),e?.attr&&Object.entries(e.attr).forEach(([i,n])=>{t.setAttribute(i,n)}),this.appendChild(t),t};HTMLElement.prototype.setCssStyles=function(l){Object.assign(this.style,l)};class S extends w{app;manifest;constructor(e,t){super(),this.app=e,this.manifest=t}addRibbonIcon(e,t,i){return this.app.ui.addRibbonIcon(e,t,i)}addStatusBarItem(){return this.app.ui.addStatusBarItem()}addCommand(e){return this.app.commands.addCommand(e)}removeCommand(e){this.app.commands.removeCommand(e)}addSettingTab(e){this.app.settings.addSettingTab(e)}registerView(e,t){this.app.workspace.registerView(e,t)}registerMarkdownPostProcessor(e,t){return this.app.editor.registerMarkdownPostProcessor(e,t)}registerMarkdownCodeBlockProcessor(e,t,i){return this.app.editor.registerMarkdownCodeBlockProcessor(e,t,i)}loadData(){return this.app.storage.loadData(this.manifest.id)}saveData(e){return this.app.storage.saveData(this.manifest.id,e)}}class E extends y{plugins=new Map;pluginAPIs=new Map;enabledPlugins=new Set;pluginSettings=new Map;moleculeContext;app;constructor(e){super(),this.moleculeContext=e,this.app=this.createApp()}createApp(){return{keymap:this.createKeymap(),scope:this.createScope(),workspace:this.createWorkspace(),vault:this.createVault(),metadataCache:this.createMetadataCache(),fileManager:this.createFileManager(),ui:this.createUI(),commands:this.createCommands(),settings:this.createSettings(),storage:this.createStorage(),editor:this.createEditor(),lastEvent:null,loadLocalStorage:e=>this.loadLocalStorage(e),saveLocalStorage:(e,t)=>this.saveLocalStorage(e,t),molecule:this.moleculeContext}}async registerObsidianPlugin(e,t){const i=e.id;if(this.plugins.has(i))throw new Error(`Plugin ${i} is already registered`);try{const n=new t(this.app,e),o={id:i,name:e.name,version:e.version,description:e.description,author:e.author,dependencies:e.dependencies||[],status:d.REGISTERED,manifest:e,instance:n,api:null};this.plugins.set(i,o),this.emit("pluginRegistered",o),console.log(`Obsidian compatible plugin ${i} registered successfully`)}catch(n){throw console.error(`Failed to register plugin ${i}:`,n),n}}async enableObsidianPlugin(e){const t=this.plugins.get(e);if(!t)throw new Error(`Plugin ${e} not found`);if(!this.enabledPlugins.has(e)){await this.checkDependencies(t);try{const i=t.instance;i.onload&&await i.onload(),t.status=d.ENABLED,this.enabledPlugins.add(e),this.emit("pluginEnabled",t),console.log(`Obsidian compatible plugin ${e} enabled successfully`)}catch(i){throw t.status=d.ERROR,this.emit("pluginError",t,i),console.error(`Failed to enable plugin ${e}:`,i),i}}}async disableObsidianPlugin(e){const t=this.plugins.get(e);if(!(!t||!this.enabledPlugins.has(e)))try{const i=t.instance;i.onunload&&await i.onunload(),i.dispose(),t.status=d.REGISTERED,this.enabledPlugins.delete(e),this.emit("pluginDisabled",t),console.log(`Obsidian compatible plugin ${e} disabled successfully`)}catch(i){throw this.emit("pluginError",t,i),console.error(`Failed to disable plugin ${e}:`,i),i}}createKeymap(){return{getRootScope:()=>this.createScope()}}createScope(){return{keys:{},parent:null}}createWorkspace(){return{onLayoutReady:e=>{setTimeout(e,100)},onFileOpen:e=>{this.on("file:open",e)},onFileClose:e=>{this.on("file:close",e)},onActiveLeafChange:e=>{this.on("leaf:active",e)},getActiveFile:()=>null,getActiveLeaf:()=>null,getLeavesOfType:e=>[],openLinkText:async(e,t,i)=>{},openFile:async(e,t)=>{},registerView:(e,t)=>{},registerHoverLinkSource:(e,t)=>{},registerExtensions:(e,t)=>{}}}createVault(){return{read:async e=>"",write:async(e,t)=>{},create:async(e,t)=>({}),delete:async e=>{},rename:async(e,t)=>{},getAbstractFileByPath:e=>null,getFiles:()=>[],getMarkdownFiles:()=>[],createFolder:async e=>({}),exists:e=>!1}}createMetadataCache(){return{getFileCache:e=>null,getFirstLinkpathDest:(e,t)=>null,getBacklinksForFile:e=>null,getForwardLinksForFile:e=>null,onChanged:e=>{this.on("metadata:changed",e)}}}createFileManager(){return{createNewMarkdownFile:async(e,t)=>({}),deleteFile:async e=>{},renameFile:async(e,t)=>{},copyFile:async(e,t)=>({})}}createUI(){return{addRibbonIcon:(e,t,i)=>{if(this.moleculeContext&&this.moleculeContext.activityBar)try{const n=`obsidian-ribbon-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;this.moleculeContext.activityBar.add({id:n,name:t,alignment:"top",sortIndex:10,icon:e,onClick:()=>{console.log(`Hello Plugin: Activity bar item clicked: ${t}`);try{i({})}catch(a){console.error("Error in onClick callback:",a)}}});const o=document.createElement("div");return o.innerHTML=e,o.title=t,o.id=n,o.style.display="none",document.body.appendChild(o),console.log(`✅ Ribbon icon added to activity bar: ${t} (${n})`),o}catch(n){console.error("Failed to add ribbon icon to activity bar:",n);const o=document.createElement("div");return o.innerHTML=e,o.title=t,o.onclick=i,o}else{console.warn("Molecule activityBar API not available, using fallback");const n=document.createElement("div");return n.innerHTML=e,n.title=t,n.onclick=i,n}},addStatusBarItem:()=>{if(this.moleculeContext&&this.moleculeContext.statusBar)try{const e=`obsidian-status-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;this.moleculeContext.statusBar.add({id:e,name:"Obsidian Plugin Status",render:()=>s.createElement("div",{id:e,style:{display:"flex",alignItems:"center",padding:"0 8px",fontSize:"12px",color:"var(--statusBar-foreground)"}},"Plugin Status")}),console.log(`✅ Status bar item added: ${e}`);const t=document.createElement("div");return t.style.display="none",t}catch(e){console.error("Failed to add status bar item:",e);const t=document.createElement("div");return t.style.display="none",t}else{console.warn("Molecule statusBar API not available, using fallback");const e=document.createElement("div");return e.style.display="none",e}},addSettingTab:e=>{}}}createCommands(){return{addCommand:e=>e,removeCommand:e=>{},executeCommandById:e=>!1}}createSettings(){return{addSettingTab:e=>{},getSetting:e=>null,setSetting:(e,t)=>{}}}createStorage(){return{loadData:async e=>this.pluginSettings.get(e)||{},saveData:async(e,t)=>{this.pluginSettings.set(e,t)}}}createEditor(){return{registerMarkdownPostProcessor:(e,t)=>e,registerMarkdownCodeBlockProcessor:(e,t,i)=>({}),registerEditorExtension:e=>{}}}loadLocalStorage(e){try{const t=localStorage.getItem(e);return t?JSON.parse(t):null}catch(t){return console.error("Failed to load from localStorage:",t),null}}saveLocalStorage(e,t){try{t===null?localStorage.removeItem(e):localStorage.setItem(e,JSON.stringify(t))}catch(i){console.error("Failed to save to localStorage:",i)}}async checkDependencies(e){for(const t of e.dependencies)if(!this.enabledPlugins.has(t))throw new Error(`Plugin ${e.id} depends on ${t} which is not enabled`)}getAllPlugins(){return Array.from(this.plugins.values())}getEnabledPlugins(){return Array.from(this.enabledPlugins).map(e=>this.plugins.get(e))}getPluginStatus(e){return this.plugins.get(e)?.status}getPlugin(e){return this.plugins.get(e)}getApp(){return this.app}}class k{api=null;async onload(e){this.api=e,console.log("RSS Plugin loaded successfully!"),this.initializeRssData(),setTimeout(()=>{this.addRssActivityBarItem()},2e3)}rssFeeds=[{id:"techcrunch",name:"TechCrunch",url:"https://techcrunch.com/feed/",icon:"📱",description:"科技新闻和创业资讯"},{id:"hackernews",name:"Hacker News",url:"https://news.ycombinator.com/rss",icon:"💻",description:"程序员社区热门话题"},{id:"github",name:"GitHub Trending",url:"https://github.com/trending.atom",icon:"🐙",description:"GitHub 热门项目"}];feedItems={};initializeRssData(){this.feedItems={techcrunch:[{id:"tc1",title:"AI 技术突破：新的语言模型性能提升 50%",link:"https://techcrunch.com/ai-breakthrough",description:"最新的人工智能研究显示，新的语言模型在多个基准测试中性能提升了 50%...",pubDate:new Date(Date.now()-7200*1e3).toISOString(),feedId:"techcrunch"},{id:"tc2",title:"电动汽车市场增长超预期",link:"https://techcrunch.com/ev-market-growth",description:"全球电动汽车销量在今年第一季度增长了 35%，超出分析师预期...",pubDate:new Date(Date.now()-14400*1e3).toISOString(),feedId:"techcrunch"}],hackernews:[{id:"hn1",title:"Rust 语言在系统编程中的优势",link:"https://news.ycombinator.com/rust-systems",description:"Rust 语言通过内存安全保证，在系统编程领域展现出独特优势...",pubDate:new Date(Date.now()-3600*1e3).toISOString(),feedId:"hackernews"},{id:"hn2",title:"WebAssembly 的未来发展",link:"https://news.ycombinator.com/wasm-future",description:"WebAssembly 技术正在改变 Web 应用的开发方式...",pubDate:new Date(Date.now()-10800*1e3).toISOString(),feedId:"hackernews"}],github:[{id:"gh1",title:"awesome-react: React 资源集合",link:"https://github.com/enaqx/awesome-react",description:"一个精心策划的 React 资源列表，包含教程、组件库、工具等...",pubDate:new Date(Date.now()-360*60*1e3).toISOString(),feedId:"github"},{id:"gh2",title:"typescript-cheatsheet: TypeScript 速查表",link:"https://github.com/typescript-cheatsheets/react",description:"React 开发者的 TypeScript 速查表，包含常用模式和最佳实践...",pubDate:new Date(Date.now()-480*60*1e3).toISOString(),feedId:"github"}]}}addRssActivityBarItem(){if(console.log("RSS Plugin: Starting to add activity bar item"),console.log("RSS Plugin: API available:",!!this.api),console.log("RSS Plugin: UI API available:",!!this.api?.ui),console.log("RSS Plugin: addActivityBarItem available:",!!this.api?.ui?.addActivityBarItem),this.api&&this.api.ui&&this.api.ui.addActivityBarItem)try{console.log("RSS Plugin: Using Molecule API to add activity bar item"),this.api.ui.addActivityBarItem({id:"rss-plugin",name:"RSS 阅读器",icon:"rss",sortIndex:1,alignment:"top",onClick:()=>{console.log("RSS Plugin: Activity bar item clicked"),this.showRssSidebar()}}),console.log("RSS Plugin: Activity bar item added via Molecule API"),this.api.molecule&&this.api.molecule.activityBar&&this.api.molecule.activityBar.onClick(e=>{console.log("RSS Plugin: ActivityBar click event received:",e),e&&e.id==="rss-plugin"&&(console.log("RSS Plugin: RSS item clicked, showing sidebar"),this.showRssSidebar())})}catch(e){console.error("RSS Plugin: Failed to add activity bar item via API:",e),this.addRssActivityBarItemViaDOM()}else console.log("RSS Plugin: Molecule UI API not available, using DOM fallback"),this.addRssActivityBarItemViaDOM()}addRssActivityBarItemViaDOM(){const e=document.querySelector('[data-testid="activityBar"]')||document.querySelector(".activityBar")||document.querySelector('[class*="activity"]')||document.querySelector('[class*="ActivityBar"]')||document.querySelector('[class*="activityBar"]')||document.querySelector(".mo-activityBar__container");if(e){console.log("RSS Plugin: Found activity bar:",e);const t=document.createElement("div");t.innerHTML="📡",t.title="RSS 阅读器",t.style.cssText=`
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        transition: background-color 0.2s;
        border-radius: 4px;
        margin: 4px 0;
        color: var(--activityBar-inactiveForeground, #cccccc);
      `,t.onmouseover=()=>{t.style.backgroundColor="rgba(255, 255, 255, 0.1)"},t.onmouseout=()=>{t.style.backgroundColor="transparent"},t.onclick=()=>{console.log("RSS Plugin: RSS icon clicked via DOM"),this.showRssSidebar()};const i=e.querySelector('[class*="item"], [class*="icon"]');i?e.insertBefore(t,i):e.appendChild(t),console.log("RSS Plugin: RSS activity bar item added at position 1 via DOM")}else console.log("RSS Plugin: Activity bar not found, retrying..."),setTimeout(()=>this.addRssActivityBarItemViaDOM(),1e3)}async onunload(){console.log("RSS Plugin unloaded")}showRssSidebar(){if(console.log("RSS Plugin: showRssSidebar called"),this.api&&this.api.molecule&&this.api.molecule.sidebar)try{console.log("RSS Plugin: Using Molecule sidebar API directly"),this.api.molecule.sidebar.add({id:"rss-sidebar",name:"RSS 阅读器",render:()=>{console.log("RSS Plugin: Rendering RSS sidebar content");const e=s.createElement("div",{style:{height:"100%",display:"flex",flexDirection:"column",backgroundColor:"#252526",color:"#cccccc"}},[s.createElement("div",{key:"header",style:{padding:"12px 16px",borderBottom:"1px solid #3c3c3c",fontWeight:"bold",fontSize:"14px"}},"📡 RSS 订阅源"),s.createElement("div",{key:"feeds",style:{flex:1,overflowY:"auto",padding:"8px 0"}},this.rssFeeds.map(t=>s.createElement("div",{key:t.id,style:{padding:"8px 16px",cursor:"pointer",transition:"background-color 0.2s",borderBottom:"1px solid #3c3c3c"},onMouseOver:i=>{i.target.style.backgroundColor="#2a2d2e"},onMouseOut:i=>{i.target.style.backgroundColor="transparent"},onClick:()=>{this.showFeedItemsInSidebar(t)}},[s.createElement("div",{key:"content",style:{display:"flex",alignItems:"center",gap:"8px"}},[s.createElement("span",{key:"icon",style:{fontSize:"16px"}},t.icon),s.createElement("div",{key:"info",style:{flex:1}},[s.createElement("div",{key:"name",style:{fontWeight:"500",marginBottom:"2px"}},t.name),s.createElement("div",{key:"desc",style:{fontSize:"12px",color:"#cccccc80"}},t.description)])])])))]);return console.log("RSS Plugin: RSS sidebar content created successfully"),e}}),console.log("RSS Plugin: Sidebar added via Molecule API directly"),this.api.molecule.sidebar.setCurrent("rss-sidebar"),console.log("RSS Plugin: Set RSS sidebar as current")}catch(e){console.error("RSS Plugin: Failed to add sidebar via Molecule API:",e),this.showRssSidebarViaDOM()}else console.log("RSS Plugin: Molecule sidebar API not available, using DOM fallback"),console.log("RSS Plugin: API available:",!!this.api),console.log("RSS Plugin: Molecule available:",!!this.api?.molecule),console.log("RSS Plugin: Sidebar available:",!!this.api?.molecule?.sidebar),this.showRssSidebarViaDOM()}showRssSidebarViaDOM(){const e=this.createRssSidebar(),t=document.querySelector('[data-testid="sidebar"]')||document.querySelector(".sidebar")||document.querySelector('[class*="sidebar"]')||document.querySelector(".mo-sidebar__content");t?(t.innerHTML="",t.appendChild(e),console.log("RSS Plugin: RSS sidebar displayed via DOM")):console.log("RSS Plugin: Sidebar not found")}createRssSidebar(){const e=document.createElement("div");e.style.cssText=`
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--vscode-sideBar-background, #252526);
      color: var(--vscode-sideBar-foreground, #cccccc);
    `;const t=document.createElement("div");t.style.cssText=`
      padding: 12px 16px;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
      font-weight: bold;
      font-size: 14px;
    `,t.innerHTML="📡 RSS 订阅源",e.appendChild(t);const i=document.createElement("div");return i.style.cssText=`
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    `,this.rssFeeds.forEach(n=>{const o=this.createFeedElement(n);i.appendChild(o)}),e.appendChild(i),e}createFeedElement(e){const t=document.createElement("div");return t.style.cssText=`
      padding: 8px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    `,t.onmouseover=()=>{t.style.backgroundColor="var(--vscode-list-hoverBackground, #2a2d2e)"},t.onmouseout=()=>{t.style.backgroundColor="transparent"},t.onclick=()=>{this.showFeedItems(e)},t.innerHTML=`
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 16px;">${e.icon}</span>
        <div style="flex: 1;">
          <div style="font-weight: 500; margin-bottom: 2px;">${e.name}</div>
          <div style="font-size: 12px; color: var(--vscode-descriptionForeground, #cccccc80);">
            ${e.description}
          </div>
        </div>
      </div>
    `,t}showFeedItemsInSidebar(e){const t=this.feedItems[e.id]||[];if(this.api&&this.api.molecule&&this.api.molecule.sidebar)try{this.api.molecule.sidebar.add({id:"rss-feed-items",name:e.name,render:()=>s.createElement("div",{style:{height:"100%",display:"flex",flexDirection:"column",backgroundColor:"#252526",color:"#cccccc"}},[s.createElement("div",{key:"header",style:{padding:"12px 16px",borderBottom:"1px solid #3c3c3c",display:"flex",alignItems:"center",gap:"8px"}},[s.createElement("span",{key:"icon",style:{fontSize:"16px"}},e.icon),s.createElement("span",{key:"name",style:{fontWeight:"bold",fontSize:"14px"}},e.name),s.createElement("button",{key:"back",style:{marginLeft:"auto",background:"none",border:"none",color:"#cccccc",cursor:"pointer",padding:"4px 8px"},onClick:()=>{this.showRssSidebar()}},"← 返回")]),s.createElement("div",{key:"items",style:{flex:1,overflowY:"auto",padding:"8px 0"}},t.map(i=>s.createElement("div",{key:i.id,style:{padding:"12px 16px",cursor:"pointer",transition:"background-color 0.2s",borderBottom:"1px solid #3c3c3c"},onMouseOver:n=>{n.target.style.backgroundColor="#2a2d2e"},onMouseOut:n=>{n.target.style.backgroundColor="transparent"},onClick:()=>{this.openArticleInEditor(i)}},[s.createElement("div",{key:"content",style:{marginBottom:"8px"}},[s.createElement("div",{key:"title",style:{fontWeight:"500",lineHeight:"1.4",marginBottom:"4px"}},i.title),s.createElement("div",{key:"desc",style:{fontSize:"12px",color:"#cccccc80",lineHeight:"1.3"}},i.description)]),s.createElement("div",{key:"date",style:{fontSize:"11px",color:"#cccccc60"}},new Date(i.pubDate).toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}))])))])}),this.api.molecule.sidebar.setCurrent("rss-feed-items")}catch(i){console.error("Failed to show feed items in sidebar:",i),this.showFeedItems(e)}else this.showFeedItems(e)}showFeedItems(e){const t=this.feedItems[e.id]||[],i=document.createElement("div");i.style.cssText=`
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: var(--vscode-sideBar-background, #252526);
      color: var(--vscode-sideBar-foreground, #cccccc);
    `;const n=document.createElement("div");n.style.cssText=`
      padding: 12px 16px;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
      display: flex;
      align-items: center;
      gap: 8px;
    `,n.innerHTML=`
      <span style="font-size: 16px;">${e.icon}</span>
      <span style="font-weight: bold; font-size: 14px;">${e.name}</span>
      <button onclick="this.goBack()" style="
        margin-left: auto;
        background: none;
        border: none;
        color: var(--vscode-foreground, #cccccc);
        cursor: pointer;
        padding: 4px 8px;
      ">← 返回</button>
    `,i.appendChild(n);const o=document.createElement("div");o.style.cssText=`
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    `,t.forEach(r=>{const c=this.createArticleElement(r);o.appendChild(c)}),i.appendChild(o),window.goBack=()=>{this.showRssSidebar()};const a=document.querySelector('[data-testid="sidebar"]')||document.querySelector(".sidebar")||document.querySelector('[class*="sidebar"]');a&&(a.innerHTML="",a.appendChild(i))}createArticleElement(e){const t=document.createElement("div");t.style.cssText=`
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid var(--vscode-sideBar-border, #3c3c3c);
    `,t.onmouseover=()=>{t.style.backgroundColor="var(--vscode-list-hoverBackground, #2a2d2e)"},t.onmouseout=()=>{t.style.backgroundColor="transparent"},t.onclick=()=>{this.openArticleInEditor(e)};const i=new Date(e.pubDate).toLocaleString("zh-CN",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});return t.innerHTML=`
      <div style="margin-bottom: 8px;">
        <div style="font-weight: 500; line-height: 1.4; margin-bottom: 4px;">
          ${e.title}
        </div>
        <div style="font-size: 12px; color: var(--vscode-descriptionForeground, #cccccc80); line-height: 1.3;">
          ${e.description}
        </div>
      </div>
      <div style="font-size: 11px; color: var(--vscode-descriptionForeground, #cccccc60);">
        ${i}
      </div>
    `,t}openArticleInEditor(e){const t=`# ${e.title}

**发布时间**: ${new Date(e.pubDate).toLocaleString("zh-CN")}
**来源**: ${this.rssFeeds.find(o=>o.id===e.feedId)?.name}
**链接**: [查看原文](${e.link})

---

${e.description}

## 完整内容

这里是文章的完整内容。在实际应用中，这里会显示从 RSS 源获取的完整文章内容。

### 主要观点

- 这是一个示例文章
- 展示了 RSS 阅读器的功能
- 支持在编辑器中查看内容

### 相关链接

- [原文链接](${e.link})
- [更多相关文章](#)

---

*本文通过 RSS 阅读器插件自动获取*
`,i=`rss-${e.id}`,n=`${e.title}.md`;if(this.api&&this.api.molecule&&this.api.molecule.editor)try{const o=this.api.molecule.editor.getState();if(o.groups?.flatMap(r=>r.data||[]).find(r=>r.id===i)){console.log("Article tab already exists, switching to it:",e.title);const r=o.groups?.find(c=>c.data?.some(u=>u.id===i));if(r){this.api.molecule.editor.setCurrent(i,r.id),console.log("Emitting ai:updateArticle event with article:",e),this.api.events.emit("ai:updateArticle",e);return}}console.log("Opening article directly in Molecule editor:",e.title),this.api.molecule.editor.open({id:i,name:n,value:t,language:"markdown",icon:"file"}),console.log("Emitting ai:updateArticle event with article:",e),this.api.events.emit("ai:updateArticle",e),console.log("Article opened successfully in editor:",e.title)}catch(o){console.error("Failed to open article in editor:",o);try{const a={id:i,name:n,content:t,language:"markdown",article:e};console.log("Falling back to event system, emitting rss:openArticle event"),this.api.events.emit("rss:openArticle",a)}catch(a){console.error("Failed to emit event as well:",a)}}else if(this.api){console.log("Molecule editor API not available, using event system");try{const o={id:i,name:n,content:t,language:"markdown",article:e};console.log("Emitting rss:openArticle event with data:",o),this.api.events.emit("rss:openArticle",o)}catch(o){console.error("Failed to emit event:",o)}}else console.error("No API available to open article")}createRssPanel(){const e=document.createElement("div");return e.innerHTML=`
      <div style="padding: 20px;">
        <h3>📡 RSS 阅读器</h3>
        <p>这是一个简单的 RSS 插件示例</p>
        
        <div style="margin: 20px 0;">
          <input 
            type="text" 
            id="rss-url" 
            placeholder="输入 RSS 地址" 
            style="width: 300px; padding: 8px; margin-right: 10px;"
            value="https://rss.cnn.com/rss/edition.rss"
          />
          <button onclick="this.loadRss()" style="padding: 8px 16px;">加载</button>
        </div>
        
        <div id="rss-content" style="border: 1px solid #ccc; padding: 15px; min-height: 200px;">
          <p>点击"加载"按钮来获取 RSS 内容</p>
        </div>
        
        <div style="margin-top: 20px;">
          <button onclick="this.addSampleFeeds()" style="padding: 8px 16px; margin-right: 10px;">
            添加示例源
          </button>
          <button onclick="this.clearFeeds()" style="padding: 8px 16px;">
            清空
          </button>
        </div>
      </div>
    `,window.loadRss=()=>this.loadRss(),window.addSampleFeeds=()=>this.addSampleFeeds(),window.clearFeeds=()=>this.clearFeeds(),e}async loadRss(){const e=document.getElementById("rss-url"),t=document.getElementById("rss-content");if(!e||!t)return;const i=e.value.trim();if(!i){t.innerHTML='<p style="color: red;">请输入 RSS 地址</p>';return}t.innerHTML="<p>正在加载 RSS 内容...</p>";try{const o=await(await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(i)}`)).json();o.status==="ok"?this.displayRssContent(o.items):t.innerHTML='<p style="color: red;">无法加载 RSS 内容</p>'}catch(n){t.innerHTML=`
        <p style="color: red;">加载失败: ${n}</p>
        <p>注意：由于 CORS 限制，这里使用了 RSS2JSON 服务作为示例</p>
      `}}displayRssContent(e){const t=document.getElementById("rss-content");if(!t)return;if(e.length===0){t.innerHTML="<p>没有找到 RSS 内容</p>";return}const i=e.slice(0,5).map(n=>`
      <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
        <h4 style="margin: 0 0 5px 0;">
          <a href="${n.link}" target="_blank" style="color: #007acc; text-decoration: none;">
            ${n.title}
          </a>
        </h4>
        <p style="margin: 0; color: #666; font-size: 12px;">
          ${new Date(n.pubDate).toLocaleDateString()}
        </p>
        <p style="margin: 5px 0 0 0; color: #333;">
          ${n.description?n.description.substring(0,150)+"...":""}
        </p>
      </div>
    `).join("");t.innerHTML=i}addSampleFeeds(){const e=document.getElementById("rss-url");if(!e)return;const t=["https://rss.cnn.com/rss/edition.rss","https://feeds.bbci.co.uk/news/rss.xml","https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"],i=t[Math.floor(Math.random()*t.length)];e.value=i||""}clearFeeds(){const e=document.getElementById("rss-content");e&&(e.innerHTML="<p>内容已清空</p>")}}const p={id:"rss-plugin",name:"RSS 阅读器",version:"1.0.0",description:"一个简单的 RSS 阅读器插件，可以订阅和阅读 RSS 源",author:"Molecule Notes Team",dependencies:[],pluginClass:k,minAppVersion:"1.0.0",isDesktopOnly:!1};class P extends S{statusBarItem=null;ribbonIcon=null;async onload(){console.log("Obsidian Example Plugin loaded!"),this.statusBarItem=this.addStatusBarItem(),this.statusBarItem.setText("📝 Obsidian Example Plugin"),this.addCommand({id:"obsidian-example-hello",name:"Say Hello",callback:()=>{console.log("Hello from Obsidian Example Plugin!"),this.showNotice("Hello from Obsidian Example Plugin!")}}),this.addSettingTab(new C(this.app,this)),this.registerMarkdownPostProcessor({type:"markdown",process:(e,t)=>{this.processMarkdown(e,t)}}),this.registerMarkdownCodeBlockProcessor("obsidian-example",(e,t,i)=>{this.processCodeBlock(e,t,i)}),this.registerEvent(this.app.workspace.onFileOpen(e=>{console.log("File opened:",e.path),this.updateStatusBar(`当前文件: ${e.name}`)})),await this.saveData({lastLoadTime:new Date().toISOString(),loadCount:(await this.loadData())?.loadCount||1}),console.log("Obsidian Example Plugin initialization completed")}async onunload(){console.log("Obsidian Example Plugin unloading..."),this.statusBarItem&&this.statusBarItem.remove(),this.ribbonIcon&&this.ribbonIcon.remove(),console.log("Obsidian Example Plugin unloaded")}processMarkdown(e,t){e.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((n,o)=>{const a=document.createElement("span");a.textContent=` [${o+1}]`,a.style.color="#007acc",a.style.fontSize="0.8em",n.appendChild(a)})}processCodeBlock(e,t,i){t.empty();const n=t.createDiv({cls:"obsidian-example-code-block"}),o=n.createDiv({cls:"code-block-title"});o.setText("Obsidian Example Code Block");const a=n.createDiv({cls:"code-block-content"});a.setText(e);const r=n.createEl("button",{text:"Process Code"});r.onclick=()=>{this.processCode(e)},n.setCssStyles({border:"1px solid #3c3c3c",borderRadius:"4px",padding:"12px",margin:"8px 0",backgroundColor:"#1e1e1e"}),o.setCssStyles({fontWeight:"bold",marginBottom:"8px",color:"#007acc"}),a.setCssStyles({fontFamily:"monospace",backgroundColor:"#2d2d30",padding:"8px",borderRadius:"2px",marginBottom:"8px"}),r.setCssStyles({backgroundColor:"#007acc",color:"white",border:"none",padding:"4px 8px",borderRadius:"2px",cursor:"pointer"})}processCode(e){console.log("Processing code:",e),this.showNotice(`处理了 ${e.length} 个字符的代码`)}updateStatusBar(e){this.statusBarItem&&this.statusBarItem.setText(e)}showNotice(e){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007acc;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},3e3)}}class C{app;plugin;id="obsidian-example-settings";name="Obsidian Example";tab;constructor(e,t){this.app=e,this.plugin=t,this.tab=this.createSettingsTab()}createSettingsTab(){const e=document.createElement("div");e.style.cssText=`
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;const t=e.createEl("h2",{text:"Obsidian Example Plugin Settings"});t.style.marginBottom="20px";const i=e.createDiv();i.style.marginBottom="16px";const n=i.createEl("label",{text:"示例设置:"});n.style.display="block",n.style.marginBottom="8px";const o=i.createEl("input",{type:"text"});o.placeholder="输入设置值",o.style.cssText=`
      width: 100%;
      padding: 8px;
      border: 1px solid #3c3c3c;
      border-radius: 4px;
      background: #1e1e1e;
      color: #cccccc;
    `;const a=e.createDiv();a.style.marginTop="20px";const r=a.createEl("button",{text:"测试功能"});r.style.cssText=`
      background: #007acc;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 8px;
    `,r.onclick=()=>{this.plugin.showNotice("测试功能已执行！")};const c=a.createEl("button",{text:"重置设置"});return c.style.cssText=`
      background: #d73a49;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    `,c.onclick=()=>{o.value="",this.plugin.showNotice("设置已重置！")},e}}const g={id:"obsidian-example-plugin",name:"Obsidian Example Plugin",version:"1.0.0",description:"一个展示 Obsidian 兼容插件系统的示例插件",author:"Molecule Team",dependencies:[],pluginClass:P,minAppVersion:"1.0.0",isDesktopOnly:!1};class M{api=null;async onload(e){this.api=e,console.log("Hello Plugin loaded successfully!"),setTimeout(()=>{this.addHelloActivityBarItem()},2e3)}async onunload(){console.log("Hello Plugin unloaded")}addHelloActivityBarItem(){if(console.log("Hello Plugin: Starting to add activity bar item"),console.log("Hello Plugin: API available:",!!this.api),console.log("Hello Plugin: UI API available:",!!this.api?.ui),console.log("Hello Plugin: addActivityBarItem available:",!!this.api?.ui?.addActivityBarItem),this.api&&this.api.ui&&this.api.ui.addActivityBarItem)try{console.log("Hello Plugin: Using Molecule API to add activity bar item"),this.api.ui.addActivityBarItem({id:"hello-plugin",name:"Hello Plugin",icon:"lightbulb",sortIndex:4,alignment:"top",onClick:()=>{console.log("Hello Plugin: Activity bar item clicked"),this.showHelloSidebar()}}),console.log("Hello Plugin: Activity bar item added via Molecule API"),this.api.molecule&&this.api.molecule.activityBar&&this.api.molecule.activityBar.onClick(e=>{console.log("Hello Plugin: ActivityBar click event received:",e),e&&e.id==="hello-plugin"&&(console.log("Hello Plugin: Hello item clicked, showing sidebar"),this.showHelloSidebar())})}catch(e){console.error("Hello Plugin: Failed to add activity bar item via API:",e),this.addHelloActivityBarItemViaDOM()}else console.log("Hello Plugin: Molecule UI API not available, using DOM fallback"),this.addHelloActivityBarItemViaDOM()}addHelloActivityBarItemViaDOM(){const e=document.querySelector('[data-testid="activityBar"]')||document.querySelector(".activityBar")||document.querySelector('[class*="activity"]')||document.querySelector('[class*="ActivityBar"]')||document.querySelector('[class*="activityBar"]')||document.querySelector(".mo-activityBar__container");if(e){console.log("Hello Plugin: Found activity bar:",e);const t=document.createElement("div");t.innerHTML="💡",t.title="Hello Plugin",t.style.cssText=`
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 20px;
        transition: background-color 0.2s;
        border-radius: 4px;
        margin: 4px 0;
        color: var(--activityBar-inactiveForeground, #cccccc);
      `,t.onmouseover=()=>{t.style.backgroundColor="rgba(255, 255, 255, 0.1)"},t.onmouseout=()=>{t.style.backgroundColor="transparent"},t.onclick=()=>{console.log("Hello Plugin: Icon clicked via DOM"),this.showHelloSidebar()};const i=e.querySelector('[class*="item"], [class*="icon"]');i?e.insertBefore(t,i):e.appendChild(t),console.log("Hello Plugin: Activity bar item added via DOM")}else console.log("Hello Plugin: Activity bar not found, retrying..."),setTimeout(()=>this.addHelloActivityBarItemViaDOM(),1e3)}showHelloSidebar(){if(console.log("Hello Plugin: showHelloSidebar called"),this.api&&this.api.molecule&&this.api.molecule.sidebar)try{console.log("Hello Plugin: Using Molecule sidebar API directly"),this.api.molecule.sidebar.add({id:"hello-sidebar",name:"Hello World",render:()=>{console.log("Hello Plugin: Rendering Hello sidebar content");const e=s.createElement("div",{style:{height:"100%",display:"flex",flexDirection:"column",backgroundColor:"#252526",color:"#cccccc",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}},[s.createElement("div",{key:"header",style:{padding:"16px 20px",borderBottom:"1px solid #3c3c3c",textAlign:"center"}},[s.createElement("h2",{key:"title",style:{color:"#007acc",margin:"0 0 8px 0",fontSize:"24px"}},"👋 Hello World"),s.createElement("div",{key:"subtitle",style:{fontSize:"14px",color:"#cccccc80"}},"这是一个简单的 Hello 插件示例！")]),s.createElement("div",{key:"features",style:{flex:1,padding:"20px",overflowY:"auto"}},[s.createElement("div",{key:"features-header",style:{marginBottom:"16px",padding:"12px 16px",backgroundColor:"#1e1e1e",borderRadius:"6px",borderLeft:"4px solid #007acc"}},[s.createElement("h3",{key:"features-title",style:{margin:"0 0 12px 0",color:"#007acc",fontSize:"16px"}},"插件功能："),s.createElement("ul",{key:"features-list",style:{margin:0,paddingLeft:"20px",lineHeight:"1.6"}},[s.createElement("li",{key:"feature1"},"✅ 点击图标显示 Hello World"),s.createElement("li",{key:"feature2"},"✅ 在侧边栏显示内容"),s.createElement("li",{key:"feature3"},"✅ 在编辑器中创建文件"),s.createElement("li",{key:"feature4"},"✅ 状态栏集成"),s.createElement("li",{key:"feature5"},"✅ 命令系统支持")])]),s.createElement("div",{key:"tech-info",style:{marginTop:"20px",padding:"12px 16px",backgroundColor:"#1e1e1e",borderRadius:"6px",fontSize:"12px",color:"#cccccc80"}},[s.createElement("div",{key:"tech1"},"🔧 技术实现："),s.createElement("div",{key:"tech2"},"• 继承 IPluginClass 接口"),s.createElement("div",{key:"tech3"},"• 使用 Molecule API"),s.createElement("div",{key:"tech4"},"• React 组件渲染"),s.createElement("div",{key:"tech5"},"• 错误处理和回退")])]),s.createElement("div",{key:"timestamp",style:{padding:"12px 20px",borderTop:"1px solid #3c3c3c",fontSize:"12px",color:"#888",textAlign:"center"}},`加载时间: ${new Date().toLocaleString("zh-CN")}`)]);return console.log("Hello Plugin: Hello sidebar content created successfully"),e}}),this.api.molecule.sidebar.setCurrent("hello-sidebar"),console.log("Hello Plugin: Sidebar displayed successfully"),this.showNotice("Hello World! 👋"),this.showHelloInEditor()}catch(e){console.error("Hello Plugin: Failed to show sidebar:",e),this.showNotice("侧边栏显示失败，请检查控制台错误")}else console.log("Hello Plugin: Molecule sidebar API not available"),this.showNotice("侧边栏API不可用")}showHelloInEditor(){const e=`# 👋 Hello World!

欢迎使用 Hello 插件！

## 功能特性

- ✅ **状态栏集成**: 在状态栏显示插件状态
- ✅ **图标点击**: 点击功能区图标触发功能
- ✅ **侧边栏显示**: 在侧边栏显示插件内容
- ✅ **编辑器集成**: 在编辑器中创建和显示内容
- ✅ **命令支持**: 支持通过命令面板调用

## 插件信息

- **插件名称**: Hello Plugin
- **版本**: 1.0.0
- **作者**: Molecule Team
- **加载时间**: ${new Date().toLocaleString("zh-CN")}

## 使用方法

1. 点击左侧活动栏的 💡 图标
2. 或使用命令面板执行 "Show Hello World"
3. 查看侧边栏和编辑器中的内容

## 技术实现

这个插件展示了如何：

- 继承 \`IPluginClass\` 接口
- 实现 \`onload\` 和 \`onunload\` 方法
- 使用 Molecule API 添加 UI 元素
- 集成 Molecule 框架功能

---

*这是一个用于验证插件开发流程的示例插件*
`,t="hello-world",i="Hello World.md";if(this.api&&this.api.molecule&&this.api.molecule.editor)try{const n=this.api.molecule.editor.getState();if(n.groups?.flatMap(a=>a.data||[]).find(a=>a.id===t)){console.log("Hello Plugin: Hello World tab already exists, switching to it");const a=n.groups?.find(r=>r.data?.some(c=>c.id===t));if(a){this.api.molecule.editor.setCurrent(t,a.id);return}}console.log("Hello Plugin: Opening Hello World in editor"),this.api.molecule.editor.open({id:t,name:i,value:e,language:"markdown",icon:"file"}),console.log("Hello Plugin: Hello World opened successfully in editor")}catch(n){console.error("Hello Plugin: Failed to open Hello World in editor:",n),this.showNotice("编辑器打开失败，请检查控制台错误")}else console.log("Hello Plugin: Molecule editor API not available"),this.showNotice("编辑器API不可用")}showNotice(e){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--notification-background, #007acc);
      color: var(--notification-foreground, white);
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      animation: slideIn 0.3s ease-out;
    `;const i=document.createElement("style");i.textContent=`
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,document.head.appendChild(i),document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t),i.parentNode&&i.parentNode.removeChild(i)},3e3)}}const h={id:"hello-plugin",name:"Hello Plugin",version:"1.0.0",description:"一个简单的 Hello World 插件，用于验证插件开发流程",author:"Molecule Team",dependencies:[],pluginClass:M,minAppVersion:"1.0.0",isDesktopOnly:!1};class B{api=null;canvasStates=new Map;async onload(e){this.api=e,console.log("Excalidraw Plugin loaded successfully!"),setTimeout(()=>{this.addExcalidrawActivityBarItem()},2e3)}async onunload(){console.log("Excalidraw Plugin unloaded")}addExcalidrawActivityBarItem(){if(console.log("Excalidraw Plugin: Starting to add activity bar item"),console.log("Excalidraw Plugin: API available:",!!this.api),console.log("Excalidraw Plugin: UI API available:",!!this.api?.ui),console.log("Excalidraw Plugin: addActivityBarItem available:",!!this.api?.ui?.addActivityBarItem),this.api&&this.api.ui&&this.api.ui.addActivityBarItem)try{console.log("Excalidraw Plugin: Using Molecule API to add activity bar item"),this.api.ui.addActivityBarItem({id:"excalidraw-plugin",name:"Excalidraw 白板",icon:"pencil",sortIndex:5,alignment:"top",onClick:()=>{console.log("Excalidraw Plugin: Activity bar item clicked"),this.showExcalidrawSidebar()}}),console.log("Excalidraw Plugin: Activity bar item added via Molecule API"),this.api.molecule&&this.api.molecule.activityBar&&this.api.molecule.activityBar.onClick(e=>{console.log("Excalidraw Plugin: ActivityBar click event received:",e),e&&e.id==="excalidraw-plugin"&&(console.log("Excalidraw Plugin: Excalidraw item clicked, showing sidebar"),this.showExcalidrawSidebar())})}catch(e){console.error("Excalidraw Plugin: Failed to add activity bar item via API:",e),this.addExcalidrawActivityBarItemViaDOM()}else console.log("Excalidraw Plugin: Molecule UI API not available, using DOM fallback"),this.addExcalidrawActivityBarItemViaDOM()}addExcalidrawActivityBarItemViaDOM(){const e=document.querySelector(".mo-activityBar__container");if(e){const t=document.createElement("div");t.innerHTML="✏️",t.title="Excalidraw 白板",t.style.cssText=`
        width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 20px; transition: background-color 0.2s; border-radius: 4px;
        margin: 4px 0; color: var(--activityBar-inactiveForeground, #cccccc);
      `,t.onclick=()=>this.showExcalidrawSidebar(),e.appendChild(t)}}showExcalidrawSidebar(){if(console.log("Excalidraw Plugin: showExcalidrawSidebar called"),this.api&&this.api.molecule&&this.api.molecule.sidebar)try{console.log("Excalidraw Plugin: Using Molecule sidebar API directly"),this.api.molecule.sidebar.add({id:"excalidraw-sidebar",name:"Excalidraw 白板",render:()=>s.createElement("div",{style:{height:"100%",display:"flex",flexDirection:"column",backgroundColor:"#252526",color:"#cccccc",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}},[s.createElement("div",{key:"header",style:{padding:"20px",borderBottom:"1px solid #3c3c3c",textAlign:"center"}},[s.createElement("h1",{key:"title",style:{color:"#007acc",margin:"0 0 8px 0",fontSize:"28px",fontWeight:"bold"}},"✏️ Excalidraw"),s.createElement("div",{key:"subtitle",style:{fontSize:"14px",color:"#cccccc80",marginBottom:"16px"}},"无限画布，无限创意"),s.createElement("button",{key:"create-button",style:{width:"100%",padding:"12px 16px",backgroundColor:"#007acc",color:"white",border:"none",borderRadius:"6px",fontSize:"14px",fontWeight:"bold",cursor:"pointer",transition:"background-color 0.2s"},onClick:()=>this.createNewCanvas()},"🆕 创建新画布")]),s.createElement("div",{key:"features",style:{flex:1,padding:"20px",overflowY:"auto"}},[s.createElement("div",{key:"features-header",style:{fontSize:"16px",fontWeight:"bold",marginBottom:"16px",color:"#007acc"}},"✨ 功能特性"),s.createElement("div",{key:"features-list",style:{fontSize:"13px",lineHeight:"1.6",color:"#cccccc80"}},[s.createElement("div",{key:"feature1"},"• 无限画布，自由创作"),s.createElement("div",{key:"feature2"},"• 多种绘图工具"),s.createElement("div",{key:"feature3"},"• 实时绘制预览"),s.createElement("div",{key:"feature4"},"• 简洁直观的界面"),s.createElement("div",{key:"feature5"},"• 支持图形、文字、箭头"),s.createElement("div",{key:"feature6"},"• 笔记和图片元素")])])])}),this.api.molecule.sidebar.setCurrent("excalidraw-sidebar"),this.showNotice("Excalidraw 白板已启动！✏️")}catch{this.showNotice("侧边栏显示失败")}}createNewCanvas(){const e=`excalidraw-${Date.now()}`,t=`画布_${new Date().toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"})}`;if(this.api&&this.api.molecule&&this.api.molecule.editor)try{this.api.molecule.editor.open({id:e,name:t,value:"Excalidraw Canvas",language:"typescript",icon:"file",breadcrumb:[{id:"app",name:"app"},{id:"plugins",name:"plugins"},{id:"excalidraw",name:"excalidraw"},{id:"canvas",name:t,icon:"file"}],render:({value:i})=>this.createExcalidrawComponent(e)}),console.log("Excalidraw Plugin: Canvas opened with custom render component"),this.showNotice("新画布已创建！🎨 现在可以在画布上绘图了")}catch(i){console.error("Excalidraw Plugin: Failed to open canvas:",i),this.showNotice("画布创建失败")}}createExcalidrawComponent(e){console.log("Excalidraw Plugin: Creating Excalidraw component for canvas:",e),this.canvasStates.has(e)||this.canvasStates.set(e,{currentTool:"pen",isDrawing:!1,startX:0,startY:0,elements:[],currentElement:null});const t=this.canvasStates.get(e);return s.createElement("div",{style:{height:"100%",width:"100%",display:"flex",flexDirection:"column",backgroundColor:"#f5f5f5",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}},[s.createElement("div",{key:"toolbar",style:{height:"60px",backgroundColor:"#2a2d2e",borderBottom:"1px solid #3c3c3c",display:"flex",alignItems:"center",padding:"0 16px",gap:"8px"}},[s.createElement("button",{key:"pen",style:this.getToolButtonStyle(t.currentTool==="pen"),onClick:()=>this.selectTool(e,"pen")},"✏️ 画笔"),s.createElement("button",{key:"line",style:this.getToolButtonStyle(t.currentTool==="line"),onClick:()=>this.selectTool(e,"line")},"📏 直线"),s.createElement("button",{key:"rectangle",style:this.getToolButtonStyle(t.currentTool==="rectangle"),onClick:()=>this.selectTool(e,"rectangle")},"⬜ 矩形"),s.createElement("button",{key:"circle",style:this.getToolButtonStyle(t.currentTool==="circle"),onClick:()=>this.selectTool(e,"circle")},"⭕ 圆形"),s.createElement("button",{key:"text",style:this.getToolButtonStyle(t.currentTool==="text"),onClick:()=>this.selectTool(e,"text")},"💬 文本"),s.createElement("button",{key:"arrow",style:this.getToolButtonStyle(t.currentTool==="arrow"),onClick:()=>this.selectTool(e,"arrow")},"➡️ 箭头"),s.createElement("div",{key:"spacer",style:{flex:1}}),s.createElement("button",{key:"clear",style:{backgroundColor:"#d73a49",color:"white",border:"none",padding:"8px 16px",borderRadius:"4px",cursor:"pointer",fontSize:"14px"},onClick:()=>this.clearCanvas(e)},"🧹 清除画布")]),s.createElement("div",{key:"canvas-container",style:{flex:1,position:"relative",backgroundColor:"#ffffff",overflow:"hidden"}},[s.createElement("div",{key:"canvas",id:`excalidraw-canvas-${e}`,style:{width:"100%",height:"100%",cursor:t.currentTool==="text"?"text":"crosshair",position:"relative",backgroundImage:`
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,backgroundSize:"20px 20px"},onMouseDown:i=>this.handleCanvasMouseDown(i,e),onMouseMove:i=>this.handleCanvasMouseMove(i,e),onMouseUp:i=>this.handleCanvasMouseUp(i,e)}),s.createElement("div",{key:"status-bar",style:{position:"absolute",bottom:"0",left:"0",right:"0",height:"30px",backgroundColor:"#2a2d2e",color:"#cccccc",display:"flex",alignItems:"center",padding:"0 16px",fontSize:"12px",borderTop:"1px solid #3c3c3c"}},[s.createElement("div",{key:"coordinates",id:`coordinates-${e}`},"坐标: 0, 0"),s.createElement("div",{key:"tool-info",id:`tool-info-${e}`,style:{flex:1,marginLeft:"16px"}},`当前工具: ${this.getToolName(t.currentTool)}`)])])])}getToolButtonStyle(e){return{width:"40px",height:"40px",border:`1px solid ${e?"#007acc":"#3c3c3c"}`,borderRadius:"6px",background:e?"#007acc":"#2a2d2e",color:e?"white":"#cccccc",cursor:"pointer",fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}selectTool(e,t){console.log("Excalidraw Plugin: Tool selected:",t,"for canvas:",e);const i=this.canvasStates.get(e);if(i){i.currentTool=t,this.canvasStates.set(e,i);const n=document.getElementById(`tool-info-${e}`);n&&(n.textContent=`当前工具: ${this.getToolName(t)}`);const o=document.getElementById(`excalidraw-canvas-${e}`);o&&(o.style.cursor=t==="text"?"text":"crosshair"),this.forceRerender(e)}}getToolName(e){return{pen:"画笔",line:"直线",rectangle:"矩形",circle:"圆形",text:"文本",arrow:"箭头"}[e]||e}forceRerender(e){console.log("Excalidraw Plugin: Force rerender for canvas:",e)}clearCanvas(e){console.log("Excalidraw Plugin: Clearing canvas:",e);const t=document.getElementById(`excalidraw-canvas-${e}`);if(t){t.querySelectorAll(".drawing-element").forEach(o=>o.remove()),this.clearPreview(e);const n=this.canvasStates.get(e);n&&(n.elements=[],n.isDrawing=!1,this.canvasStates.set(e,n))}}handleCanvasMouseDown(e,t){console.log("Excalidraw Plugin: Mouse down on canvas:",t);const i=this.canvasStates.get(t);if(!i)return;const n=document.getElementById(`excalidraw-canvas-${t}`);if(!n)return;const o=n.getBoundingClientRect(),a=Math.round(e.clientX-o.left),r=Math.round(e.clientY-o.top);i.isDrawing=!0,i.startX=a,i.startY=r,i.currentTool==="text"&&this.createTextElement(t,a,r),this.canvasStates.set(t,i)}handleCanvasMouseMove(e,t){const i=document.getElementById(`excalidraw-canvas-${t}`);if(!i)return;const n=i.getBoundingClientRect(),o=Math.round(e.clientX-n.left),a=Math.round(e.clientY-n.top),r=document.getElementById(`coordinates-${t}`);r&&(r.textContent=`坐标: ${o}, ${a}`);const c=this.canvasStates.get(t);!c||!c.isDrawing||this.updateDrawingPreview(t,o,a)}handleCanvasMouseUp(e,t){console.log("Excalidraw Plugin: Mouse up on canvas:",t);const i=this.canvasStates.get(t);if(!i||!i.isDrawing)return;const n=document.getElementById(`excalidraw-canvas-${t}`);if(!n)return;const o=n.getBoundingClientRect(),a=Math.round(e.clientX-o.left),r=Math.round(e.clientY-o.top);this.createElement(t,i.startX,i.startY,a,r),i.isDrawing=!1,this.canvasStates.set(t,i),this.clearPreview(t)}createElement(e,t,i,n,o){const a=this.canvasStates.get(e);if(!a)return;const r=document.getElementById(`excalidraw-canvas-${e}`);if(!r)return;const c=document.createElement("div");switch(c.className="drawing-element",c.style.position="absolute",c.style.pointerEvents="none",a.currentTool){case"pen":this.createPenStroke(r,t,i,n,o);break;case"line":this.createLine(r,c,t,i,n,o);break;case"rectangle":this.createRectangle(r,c,t,i,n,o);break;case"circle":this.createCircle(r,c,t,i,n,o);break;case"arrow":this.createArrow(r,c,t,i,n,o);break}(c.style.width||c.style.height)&&(r.appendChild(c),a.elements.push(c),this.canvasStates.set(e,a))}createPenStroke(e,t,i,n,o){const a=document.createElement("div");a.className="drawing-element",a.style.position="absolute",a.style.pointerEvents="none",a.style.background="#007acc",a.style.height="2px",a.style.transformOrigin="left center";const r=Math.sqrt(Math.pow(n-t,2)+Math.pow(o-i,2)),c=Math.atan2(o-i,n-t);a.style.left=t+"px",a.style.top=i+"px",a.style.width=r+"px",a.style.transform=`rotate(${c}rad)`,e.appendChild(a)}createLine(e,t,i,n,o,a){const r=Math.sqrt(Math.pow(o-i,2)+Math.pow(a-n,2)),c=Math.atan2(a-n,o-i);t.style.left=i+"px",t.style.top=n+"px",t.style.width=r+"px",t.style.height="2px",t.style.background="#007acc",t.style.transformOrigin="left center",t.style.transform=`rotate(${c}rad)`}createRectangle(e,t,i,n,o,a){const r=Math.abs(o-i),c=Math.abs(a-n),u=Math.min(i,o),b=Math.min(n,a);t.style.left=u+"px",t.style.top=b+"px",t.style.width=r+"px",t.style.height=c+"px",t.style.border="2px solid #007acc",t.style.background="rgba(0, 122, 204, 0.1)"}createCircle(e,t,i,n,o,a){const r=Math.sqrt(Math.pow(o-i,2)+Math.pow(a-n,2));t.style.left=i-r+"px",t.style.top=n-r+"px",t.style.width=r*2+"px",t.style.height=r*2+"px",t.style.border="2px solid #007acc",t.style.background="rgba(0, 122, 204, 0.1)",t.style.borderRadius="50%"}createArrow(e,t,i,n,o,a){this.createLine(e,t,i,n,o,a),t.style.borderRight="8px solid transparent",t.style.borderLeft="8px solid transparent",t.style.borderTop="8px solid #007acc",t.style.width="0",t.style.height="0",t.style.left=o+"px",t.style.top=a+"px",t.style.transform=`rotate(${Math.atan2(a-n,o-i)}rad)`}createTextElement(e,t,i){const n=document.getElementById(`excalidraw-canvas-${e}`);if(!n)return;const o=document.createElement("textarea");o.className="drawing-element",o.style.position="absolute",o.style.left=t+"px",o.style.top=i+"px",o.style.border="none",o.style.background="transparent",o.style.color="#333",o.style.fontSize="14px",o.style.padding="4px",o.style.minWidth="20px",o.style.minHeight="20px",o.style.resize="none",o.style.outline="none",o.style.fontFamily="inherit",o.placeholder="输入文本...",o.addEventListener("blur",()=>{o.value.trim()||o.remove()}),o.addEventListener("keydown",a=>{a.key==="Enter"&&!a.shiftKey&&(a.preventDefault(),o.blur())}),n.appendChild(o),o.focus()}updateDrawingPreview(e,t,i){this.clearPreview(e);const n=this.canvasStates.get(e);if(!n||n.currentTool==="pen")return;const o=document.getElementById(`excalidraw-canvas-${e}`);if(!o)return;const a=document.createElement("div");switch(a.className="drawing-element",a.style.position="absolute",a.style.pointerEvents="none",a.style.opacity="0.5",n.currentTool){case"line":this.createLine(o,a,n.startX,n.startY,t,i);break;case"rectangle":this.createRectangle(o,a,n.startX,n.startY,t,i);break;case"circle":this.createCircle(o,a,n.startX,n.startY,t,i);break;case"arrow":this.createArrow(o,a,n.startX,n.startY,t,i);break}(a.style.width||a.style.height)&&(a.id=`drawing-preview-${e}`,o.appendChild(a))}clearPreview(e){const t=document.getElementById(`drawing-preview-${e}`);t&&t.remove()}generateCanvasHTML(){return`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Excalidraw 画布</title>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, sans-serif; background: #f5f5f5; }
        .container { display: flex; height: 100vh; }
        .toolbar { width: 60px; background: #2a2d2e; padding: 16px 8px; display: flex; flex-direction: column; gap: 8px; }
        .tool-button { width: 40px; height: 40px; border: 1px solid #3c3c3c; border-radius: 6px; background: #2a2d2e; color: #cccccc; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
        .tool-button:hover { background: #3c3c3c; border-color: #007acc; }
        .tool-button.active { background: #007acc; border-color: #007acc; color: white; }
        .canvas-area { flex: 1; background: #ffffff; position: relative; }
        .canvas { width: 100%; height: 100%; cursor: crosshair; position: relative; }
        .canvas-grid { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; }
        .drawing-element { position: absolute; pointer-events: none; }
        .line { background: #007acc; height: 2px; transform-origin: left center; }
        .shape { border: 2px solid #007acc; background: rgba(0, 122, 204, 0.1); }
        .status-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 30px; background: #2a2d2e; color: #cccccc; display: flex; align-items: center; padding: 0 16px; font-size: 12px; border-top: 1px solid #3c3c3c; }
        .clear-button { background: #d73a49; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="toolbar">
            <button class="tool-button active" title="画笔" data-tool="pen">✏️</button>
            <button class="tool-button" title="直线" data-tool="line">📏</button>
            <button class="tool-button" title="矩形" data-tool="rectangle">⬜</button>
            <button class="tool-button" title="圆形" data-tool="circle">⭕</button>
            <button class="tool-button" title="文本" data-tool="text">💬</button>
            <button class="tool-button" title="箭头" data-tool="arrow">➡️</button>
        </div>
        <div class="canvas-area">
            <div class="canvas" id="excalidraw-canvas">
                <div class="canvas-grid"></div>
            </div>
            <div class="status-bar">
                <div id="coordinates">坐标: 0, 0</div>
                <div id="tool-info" style="flex: 1; margin-left: 16px;">当前工具: 画笔</div>
                <button class="clear-button" id="clear-button">清除画布</button>
            </div>
        </div>
    </div>
    <script>
        class ExcalidrawCanvas {
            constructor() {
                this.canvas = document.getElementById('excalidraw-canvas');
                this.toolButtons = document.querySelectorAll('.tool-button');
                this.coordinates = document.getElementById('coordinates');
                this.toolInfo = document.getElementById('tool-info');
                this.clearButton = document.getElementById('clear-button');
                
                this.currentTool = 'pen';
                this.isDrawing = false;
                this.startX = 0;
                this.startY = 0;
                this.elements = [];
                
                this.initializeEventListeners();
            }
            
            initializeEventListeners() {
                this.toolButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.selectTool(e.target.dataset.tool);
                    });
                });
                
                this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
                this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
                this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
                
                this.clearButton.addEventListener('click', () => this.clearCanvas());
                
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = Math.round(e.clientX - rect.left);
                    const y = Math.round(e.clientY - rect.top);
                    this.coordinates.textContent = \`坐标: \${x}, \${y}\`;
                });
            }
            
            selectTool(tool) {
                this.currentTool = tool;
                this.toolButtons.forEach(button => {
                    button.classList.remove('active');
                    if (button.dataset.tool === tool) {
                        button.classList.add('active');
                    }
                });
                
                const toolNames = { pen: '画笔', line: '直线', rectangle: '矩形', circle: '圆形', text: '文本', arrow: '箭头' };
                this.toolInfo.textContent = \`当前工具: \${toolNames[tool]}\`;
                this.canvas.style.cursor = tool === 'text' ? 'text' : 'crosshair';
            }
            
            handleMouseDown(e) {
                this.isDrawing = true;
                const rect = this.canvas.getBoundingClientRect();
                this.startX = e.clientX - rect.left;
                this.startY = e.clientY - rect.top;
                
                if (this.currentTool === 'text') {
                    this.createTextElement(this.startX, this.startY);
                }
            }
            
            handleMouseMove(e) {
                if (!this.isDrawing) return;
                const rect = this.canvas.getBoundingClientRect();
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;
                this.updateDrawingPreview(currentX, currentY);
            }
            
            handleMouseUp(e) {
                if (!this.isDrawing) return;
                const rect = this.canvas.getBoundingClientRect();
                const endX = e.clientX - rect.left;
                const endY = e.clientY - rect.top;
                this.createElement(this.startX, this.startY, endX, endY);
                this.isDrawing = false;
                this.clearPreview();
            }
            
            createElement(startX, startY, endX, endY) {
                const element = document.createElement('div');
                element.className = 'drawing-element';
                
                switch (this.currentTool) {
                    case 'pen':
                        this.createPenStroke(startX, startY, endX, endY);
                        break;
                    case 'line':
                        this.createLine(element, startX, startY, endX, endY);
                        break;
                    case 'rectangle':
                        this.createRectangle(element, startX, startY, endX, endY);
                        break;
                    case 'circle':
                        this.createCircle(element, startX, startY, endX, endY);
                        break;
                    case 'arrow':
                        this.createArrow(element, startX, startY, endX, endY);
                        break;
                }
                
                if (element.style.width || element.style.height) {
                    this.canvas.appendChild(element);
                    this.elements.push(element);
                }
            }
            
            createPenStroke(startX, startY, endX, endY) {
                const line = document.createElement('div');
                line.className = 'drawing-element line';
                const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                const angle = Math.atan2(endY - startY, endX - startX);
                line.style.left = startX + 'px';
                line.style.top = startY + 'px';
                line.style.width = length + 'px';
                line.style.transform = \`rotate(\${angle}rad)\`;
                this.canvas.appendChild(line);
                this.elements.push(line);
            }
            
            createLine(element, startX, startY, endX, endY) {
                const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                const angle = Math.atan2(endY - startY, endX - startX);
                element.style.left = startX + 'px';
                element.style.top = startY + 'px';
                element.style.width = length + 'px';
                element.style.height = '2px';
                element.style.backgroundColor = '#007acc';
                element.style.transformOrigin = 'left center';
                element.style.transform = \`rotate(\${angle}rad)\`;
            }
            
            createRectangle(element, startX, startY, endX, endY) {
                const width = Math.abs(endX - startX);
                const height = Math.abs(endY - startY);
                const left = Math.min(startX, endX);
                const top = Math.min(startY, endY);
                element.style.left = left + 'px';
                element.style.top = top + 'px';
                element.style.width = width + 'px';
                element.style.height = height + 'px';
                element.style.border = '2px solid #007acc';
                element.style.backgroundColor = 'rgba(0, 122, 204, 0.1)';
            }
            
            createCircle(element, startX, startY, endX, endY) {
                const radius = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
                element.style.left = (startX - radius) + 'px';
                element.style.top = (startY - radius) + 'px';
                element.style.width = (radius * 2) + 'px';
                element.style.height = (radius * 2) + 'px';
                element.style.border = '2px solid #007acc';
                element.style.backgroundColor = 'rgba(0, 122, 204, 0.1)';
                element.style.borderRadius = '50%';
            }
            
            createArrow(element, startX, startY, endX, endY) {
                this.createLine(element, startX, startY, endX, endY);
                element.style.borderRight = '8px solid transparent';
                element.style.borderLeft = '8px solid transparent';
                element.style.borderTop = '8px solid #007acc';
                element.style.width = '0';
                element.style.height = '0';
                element.style.left = endX + 'px';
                element.style.top = endY + 'px';
                element.style.transform = \`rotate(\${Math.atan2(endY - startY, endX - startX)}rad)\`;
            }
            
            createTextElement(x, y) {
                const textArea = document.createElement('textarea');
                textArea.className = 'drawing-element';
                textArea.style.left = x + 'px';
                textArea.style.top = y + 'px';
                textArea.style.position = 'absolute';
                textArea.style.border = 'none';
                textArea.style.background = 'transparent';
                textArea.style.color = '#333';
                textArea.style.fontSize = '14px';
                textArea.style.padding = '4px';
                textArea.style.minWidth = '20px';
                textArea.style.minHeight = '20px';
                textArea.style.resize = 'none';
                textArea.style.outline = 'none';
                textArea.style.fontFamily = 'inherit';
                textArea.placeholder = '输入文本...';
                
                textArea.addEventListener('blur', () => {
                    if (!textArea.value.trim()) {
                        textArea.remove();
                    }
                });
                
                textArea.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        textArea.blur();
                    }
                });
                
                this.canvas.appendChild(textArea);
                textArea.focus();
                this.elements.push(textArea);
            }
            
            updateDrawingPreview(currentX, currentY) {
                this.clearPreview();
                if (this.currentTool === 'pen') return;
                
                const preview = document.createElement('div');
                preview.className = 'drawing-element';
                preview.style.opacity = '0.5';
                
                switch (this.currentTool) {
                    case 'line':
                        this.createLine(preview, this.startX, this.startY, currentX, currentY);
                        break;
                    case 'rectangle':
                        this.createRectangle(preview, this.startX, this.startY, currentX, currentY);
                        break;
                    case 'circle':
                        this.createCircle(preview, this.startX, this.startY, currentX, currentY);
                        break;
                    case 'arrow':
                        this.createArrow(preview, this.startX, this.startY, currentX, currentY);
                        break;
                }
                
                if (preview.style.width || preview.style.height) {
                    preview.id = 'drawing-preview';
                    this.canvas.appendChild(preview);
                }
            }
            
            clearPreview() {
                const preview = document.getElementById('drawing-preview');
                if (preview) {
                    preview.remove();
                }
            }
            
            clearCanvas() {
                this.elements.forEach(element => element.remove());
                this.elements = [];
                this.clearPreview();
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            new ExcalidrawCanvas();
        });
    <\/script>
</body>
</html>`}showNotice(e){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007acc;
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      z-index: 10000;
      font-family: -apple-system, sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `,document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.parentNode.removeChild(t)},3e3)}}const m={id:"excalidraw-plugin",name:"Excalidraw 白板",version:"1.0.0",description:"一个简单的 Excalidraw 白板插件，提供无限画布功能",author:"Molecule Team",dependencies:[],pluginClass:B,minAppVersion:"1.0.0",isDesktopOnly:!1};class A{pluginManager;obsidianPluginManager;moleculeContext;constructor(e){this.moleculeContext=e,this.pluginManager=new f(e),this.obsidianPluginManager=new E(e),this.setupPluginManager(),this.setupObsidianPluginManager()}setupPluginManager(){this.pluginManager.on("pluginRegistered",e=>{console.log("Plugin registered:",e.name)}),this.pluginManager.on("pluginEnabled",e=>{console.log("Plugin enabled:",e.name);try{this.moleculeContext.notification&&this.moleculeContext.notification.open&&this.moleculeContext.notification.open({id:`plugin-enabled-${e.id}`,value:`插件 "${e.name}" 已启用`,type:"success"})}catch{console.log("Plugin enabled:",e.name)}}),this.pluginManager.on("pluginError",(e,t)=>{console.error("Plugin error:",e.name,t);try{this.moleculeContext.notification&&this.moleculeContext.notification.open&&this.moleculeContext.notification.open({id:`plugin-error-${e.id}`,value:`插件 "${e.name}" 加载失败: ${t.message}`,type:"error"})}catch(i){console.error("Plugin error:",e.name,i)}})}setupObsidianPluginManager(){this.obsidianPluginManager.on("pluginRegistered",e=>{console.log("Obsidian compatible plugin registered:",e.name)}),this.obsidianPluginManager.on("pluginEnabled",e=>{console.log("Obsidian compatible plugin enabled:",e.name);try{this.moleculeContext.notification&&this.moleculeContext.notification.open&&this.moleculeContext.notification.open({id:`obsidian-plugin-enabled-${e.id}`,value:`Obsidian 兼容插件 "${e.name}" 已启用`,type:"success"})}catch{console.log("Obsidian compatible plugin enabled:",e.name)}}),this.obsidianPluginManager.on("pluginError",(e,t)=>{console.error("Obsidian compatible plugin error:",e.name,t);try{this.moleculeContext.notification&&this.moleculeContext.notification.open&&this.moleculeContext.notification.open({id:`obsidian-plugin-error-${e.id}`,value:`Obsidian 兼容插件 "${e.name}" 加载失败: ${t.message}`,type:"error"})}catch(i){console.error("Obsidian compatible plugin error:",e.name,i)}})}async initialize(){console.log("Initializing plugin system..."),await this.registerBuiltinPlugins(),await this.registerObsidianPlugins(),await this.enableAllPlugins(),console.log("Plugin system initialized")}async registerBuiltinPlugins(){await this.pluginManager.registerPlugin(p,p.pluginClass),await this.pluginManager.registerPlugin(h,h.pluginClass),await this.pluginManager.registerPlugin(m,m.pluginClass)}async registerObsidianPlugins(){await this.obsidianPluginManager.registerObsidianPlugin(g,g.pluginClass)}async enableAllPlugins(){const e=this.pluginManager.getAllPlugins();for(const i of e)try{await this.pluginManager.enablePlugin(i.id)}catch(n){console.error(`Failed to enable plugin ${i.id}:`,n)}const t=this.obsidianPluginManager.getAllPlugins();for(const i of t)try{await this.obsidianPluginManager.enableObsidianPlugin(i.id)}catch(n){console.error(`Failed to enable Obsidian plugin ${i.id}:`,n)}}getPluginManager(){return this.pluginManager}getObsidianPluginManager(){return this.obsidianPluginManager}getAllPlugins(){const e=this.pluginManager.getAllPlugins(),t=this.obsidianPluginManager.getAllPlugins();return[...e,...t]}getEnabledPlugins(){const e=this.pluginManager.getEnabledPlugins(),t=this.obsidianPluginManager.getEnabledPlugins();return[...e,...t]}getObsidianApp(){return this.obsidianPluginManager.getApp()}}const F={id:"TestExtension",name:"TestExtension",contributes:{[x.Modules]:{}},activate(l,e){console.log("TestExtension activated");let t=null;l.layout.setAuxiliaryBar(!0),setTimeout(()=>{try{l.auxiliaryBar.add({id:"ai-assistant",name:"AI 助手",icon:"lightbulb",render:()=>s.createElement("div",{style:{padding:"20px",color:"#cccccc",backgroundColor:"#252526",height:"100%"}},[s.createElement("h2",{key:"title"},"AI 助手"),s.createElement("p",{key:"content"},"这是一个 AI 助手面板，用于测试辅助工具栏功能。"),s.createElement("p",{key:"status"},"状态: 正常运行")])}),l.auxiliaryBar.setCurrent("ai-assistant"),l.layout.setAuxiliaryBar(!0),console.log("AI Assistant added to auxiliary bar"),console.log("Auxiliary bar should be visible now")}catch(i){console.error("Failed to add AI Assistant to auxiliary bar:",i)}},1e3),l.activityBar.add({id:"testPane",name:"测试面板",alignment:"top",sortIndex:2,icon:"beaker"}),l.activityBar.add({id:"pluginManager",name:"插件管理",alignment:"top",sortIndex:3,icon:"rocket"}),l.sidebar.add({id:"testPane",name:"测试面板",render:()=>s.createElement("div",{style:{padding:"20px",color:"#cccccc",backgroundColor:"#252526",height:"100%"}},[s.createElement("h2",{key:"title"},"测试面板"),s.createElement("p",{key:"content"},"这是一个测试面板，用于验证 Molecule 框架是否正常工作。"),s.createElement("p",{key:"status"},"状态: 正常运行")])}),setTimeout(()=>{try{console.log("Starting plugin system initialization..."),t=new A(l),t.initialize().then(()=>{console.log("Plugin system initialized successfully")}).catch(i=>{console.error("Failed to initialize plugin system:",i)})}catch(i){console.error("Failed to create plugin system:",i)}},2e3),setTimeout(()=>{l.sidebar.add({id:"pluginManager",name:"插件管理",render:()=>s.createElement("div",{style:{padding:"20px",color:"#cccccc",backgroundColor:"#252526",height:"100%"}},[s.createElement("h2",{key:"title"},"插件管理"),s.createElement("p",{key:"content"},"插件系统状态: "+(t?"已初始化":"未初始化")),s.createElement("p",{key:"plugins"},"已加载插件: Hello Plugin"),s.createElement("button",{key:"refresh",onClick:()=>{console.log("刷新插件列表"),window.location.reload()},style:{padding:"8px 16px",backgroundColor:"#007acc",color:"white",border:"none",borderRadius:"4px",cursor:"pointer",marginTop:"10px"}},"刷新")])})},3e3),console.log("TestExtension setup completed")}};export{F as TestExtension};
//# sourceMappingURL=TestExtension-U3inx9s6.js.map
