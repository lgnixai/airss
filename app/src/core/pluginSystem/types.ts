export enum PluginStatus {
  REGISTERED = 'registered',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ERROR = 'error'
}

export interface IPluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies?: string[];
  pluginClass: any;
  minAppVersion?: string;
  isDesktopOnly?: boolean;
}

export interface IPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  dependencies: string[];
  status: PluginStatus;
  manifest: IPluginManifest;
  instance: any;
  api: IPluginAPI | null;
}

export interface IFileSystemAPI {
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  listFiles: (path: string) => Promise<string[]>;
  createFolder: (path: string) => Promise<void>;
}

export interface IUiAPI {
  addRibbonIcon: (icon: string, title: string, callback: () => void) => void;
  addStatusBarItem: (element: HTMLElement) => void;
  addSettingTab: (tab: any) => void;
  registerView: (id: string, view: any) => void;
  addActivityBarItem?: (item: {
    id: string;
    name: string;
    icon: string;
    sortIndex?: number;
    alignment?: 'top' | 'bottom';
    onClick: () => void;
  }) => void;
  addSidebarItem?: (item: {
    id: string;
    name: string;
    render: () => HTMLElement;
  }) => void;
  setAuxiliaryBar?: (visible: boolean) => void;
  addAuxiliaryBarItem?: (item: {
    id: string;
    name: string;
    icon: string;
    render: () => HTMLElement;
  }) => void;
  setCurrentAuxiliaryBar?: (id: string) => void;
}

export interface IEventsAPI {
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
}

export interface ISettingsAPI {
  get: (key: string, defaultValue?: any) => any;
  set: (key: string, value: any) => void;
  getAll: () => any;
}

export interface IAiAPI {
  chat: (message: string) => Promise<string>;
  summarize: (content: string) => Promise<string>;
  translate: (content: string, targetLang: string) => Promise<string>;
}

export interface IUtilsAPI {
  debounce: (func: Function, wait: number) => Function;
  throttle: (func: Function, wait: number) => Function;
  generateId: () => string;
}

export interface IPluginAPI {
  // 文件系统 API
  fileSystem: {
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, content: string) => Promise<void>;
    deleteFile: (path: string) => Promise<void>;
    listFiles: (path: string) => Promise<string[]>;
    createFolder: (path: string) => Promise<void>;
  };

  // UI API
  ui: IUiAPI;

  // 事件 API
  events: {
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback: (...args: any[]) => void) => void;
    emit: (event: string, ...args: any[]) => void;
  };

  // 设置 API
  settings: {
    get: (key: string, defaultValue?: any) => any;
    set: (key: string, value: any) => void;
    getAll: () => any;
  };

  // AI API
  ai: {
    chat: (message: string) => Promise<string>;
    summarize: (content: string) => Promise<string>;
    translate: (content: string, targetLang: string) => Promise<string>;
  };

  // 工具 API
  utils: {
    debounce: (func: Function, wait: number) => Function;
    throttle: (func: Function, wait: number) => Function;
    generateId: () => string;
  };

  // Molecule 上下文
  molecule?: any;
}

export interface IPluginClass {
  onload?: (api: IPluginAPI) => Promise<void> | void;
  onunload?: () => Promise<void> | void;
} 