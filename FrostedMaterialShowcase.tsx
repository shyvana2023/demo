/**
 * Frosted Material UI Component Library Showcase
 * ===============================================
 * 磨砂质感 UI 组件库完整展示
 * 
 * @author Design System Team
 * @version 1.0.0
 * 
 * 使用的核心依赖包:
 * ==================
 * 
 * 1. React 18.x
 *    - 用于组件构建
 *    - npm: react, react-dom
 * 
 * 2. Tailwind CSS 3.x
 *    - 工具类 CSS 框架
 *    - 用于快速布局和样式
 *    - npm: tailwindcss, postcss, autoprefixer
 * 
 * 3. Lucide React 0.487.0
 *    - 图标库
 *    - 用于所有图标展示
 *    - npm: lucide-react
 * 
 * 4. CSS backdrop-filter
 *    - 原生 CSS 特性
 *    - 用于磨砂玻璃效果
 *    - 浏览器支持: Chrome 76+, Firefox 103+, Safari 9+
 * 
 * 特性:
 * =====
 * - 亮/暗双模式完整支持
 * - 15+ 组件类型展示
 * - 详细参数文档
 * - 实时代码预览
 */

import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Home,
  Settings,
  User,
  Search,
  Bell,
  Menu,
  ChevronRight,
  Check,
  X,
  Plus,
  Trash2,
  Edit,
  MoreVertical,
  Calendar,
  Mail,
  FileText,
  Folder,
  Image,
  Music,
  Video,
  Heart,
  Star,
  Bookmark,
  Share2,
  Download,
  Upload,
  RefreshCw,
  Loader2,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import { getFrostedCSSVariables, frostedComponentTokens } from '../tokens/frosted';
import '../styles/frosted-glass.css';

// ============================================
// Type Definitions
// ============================================

export interface ComponentDoc {
  name: string;
  description: string;
  props: Array<{
    name: string;
    type: string;
    default: string;
    description: string;
  }>;
  dependencies: string[];
}

// ============================================
// Theme Provider for Showcase
// ============================================

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const cssVars = getFrostedCSSVariables(isDark ? 'dark' : 'light');
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value as string);
    });
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => React.useContext(ThemeContext);

// ============================================
// Component: ThemeToggle
// ============================================

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="frosted-button frosted-highlight"
      style={{ gap: '8px' }}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
};

// ============================================
// Section 1: Main Panel
// ============================================

const MainPanelSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          1. Main Panel
        </h2>
        <span className="frosted-badge frosted-badge-cyan">Container</span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Panel Demo */}
        <div 
          className="frosted-card frosted-highlight"
          style={{ minHeight: '200px' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="frosted-icon frosted-icon-active">
              <Home size={20} />
            </div>
            <div>
              <h3 style={{ color: 'var(--frosted-text-primary)', fontWeight: 600 }}>
                Dashboard
              </h3>
              <p style={{ color: 'var(--frosted-text-tertiary)', fontSize: '12px' }}>
                User Info • 20 minutes
              </p>
            </div>
          </div>
          <div 
            className="rounded-lg p-4"
            style={{ 
              background: 'var(--frosted-bg-subtle)',
              border: '1px solid var(--frosted-border-default)'
            }}
          >
            <p style={{ color: 'var(--frosted-text-secondary)' }}>
              Main content area with frosted glass background.
              This panel demonstrates the subtle transparency effect.
            </p>
          </div>
        </div>

        {/* Documentation */}
        <div className="frosted-card" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <h4 style={{ color: 'var(--frosted-text-primary)', fontWeight: 600, marginBottom: '12px' }}>
            技术规格
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--frosted-text-secondary)' }}>
            <li><strong>Material:</strong> Flat White (#FFFFFF)</li>
            <li><strong>Opacity:</strong> 70% (default), 40% (subtle), 85% (emphasis)</li>
            <li><strong>Shadow:</strong> 0 2px 6px rgba(0,0,0,0.08)</li>
            <li><strong>Border Radius:</strong> 16px</li>
            <li><strong>Blur:</strong> 8px (md) backdrop-filter</li>
            <li><strong>Border:</strong> 1px solid rgba(255,255,255,0.5)</li>
          </ul>
          
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
            <code className="text-xs" style={{ color: 'var(--frosted-cyan-text)' }}>
              {`.frosted-card {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.5);
}`}
            </code>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 2: Header
// ============================================

const HeaderSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          2. Header / Top Bar
        </h2>
        <span className="frosted-badge frosted-badge-purple">Navigation</span>
      </div>

      <div className="frosted-glass-emphasis frosted-highlight rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
                style={{ background: 'var(--frosted-cyan-bg)', color: 'var(--frosted-cyan-text)' }}
              >
                P
              </div>
              <span style={{ color: 'var(--frosted-text-primary)', fontWeight: 600 }}>
                PRAM
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-4 text-sm">
              <span style={{ color: 'var(--frosted-text-secondary)' }}>Home</span>
              <ChevronRight size={14} style={{ color: 'var(--frosted-text-tertiary)' }} />
              <span style={{ color: 'var(--frosted-text-secondary)' }}>Production</span>
              <ChevronRight size={14} style={{ color: 'var(--frosted-text-tertiary)' }} />
              <span style={{ color: 'var(--frosted-text-primary)' }}>Recipe Configuration</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="frosted-input" style={{ width: '200px', height: '36px' }}>
              <div className="flex items-center gap-2 h-full">
                <Search size={16} style={{ color: 'var(--frosted-text-tertiary)' }} />
                <span style={{ color: 'var(--frosted-text-tertiary)', fontSize: '13px' }}>
                  Search...
                </span>
              </div>
            </div>
            <button className="frosted-icon">
              <Bell size={18} />
            </button>
            <div className="w-8 h-8 rounded-full frosted-glass-subtle flex items-center justify-center">
              <User size={16} />
            </div>
            <button className="frosted-button frosted-button-cyan text-sm" style={{ height: '32px' }}>
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Material</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Flat White (#FFFFFF)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Shadow</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>0 1px 5px rgba(0,0,0,0.08)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Height</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>64px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Action Button</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>3D Frosted Glass (Cyan)</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Crystal Checkbox & Radio Components - Cyan Theme
// ============================================

interface CrystalCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const CrystalCheckbox: React.FC<CrystalCheckboxProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      {/* 外框 - 柱子光泽度 (与 Toggle 轨道一致) */}
      <div
        className="relative w-5 h-5 rounded-md overflow-hidden transition-all duration-150"
        style={{
          background: checked 
            ? 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(6, 182, 212, 0.6) 20%, rgba(6, 182, 212, 0.6) 80%, rgba(8, 145, 178, 0.8) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, var(--frosted-bg-subtle) 20%, var(--frosted-bg-subtle) 80%, rgba(0,0,0,0.06) 100%)',
          border: checked
            ? '1px solid rgba(6, 182, 212, 0.6)'
            : '1px solid var(--frosted-border-default)',
          boxShadow: checked
            ? '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 -1px 3px rgba(0,0,0,0.12) inset, 0 2px 8px rgba(6, 182, 212, 0.35), 0 0 16px rgba(6, 182, 212, 0.25)'
            : '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 -1px 3px rgba(0,0,0,0.1) inset, 0 2px 4px rgba(0,0,0,0.1)',
        }}
        onClick={() => onChange(!checked)}
      >
        {/* 柱子顶部光泽层 */}
        <div
          className="absolute top-0.5 left-0.5 right-0.5 h-1/3 rounded-t-sm pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
            borderRadius: '2px 2px 0 0',
          }}
        />
        
        {/* 水晶珠子 - 纯珠子效果 (与 Toggle Knob 一致) */}
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-3 h-3 rounded-full relative"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #22d3ee 35%, #06b6d4 100%)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.4) inset',
              }}
            >
              {/* 珠子主高光 */}
              <div
                className="absolute top-0.5 left-0.5 w-1 h-1 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 100%)',
                }}
              />
              {/* 珠子次高光 */}
              <div
                className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  filter: 'blur(1px)',
                }}
              />
            </div>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm transition-colors duration-150" style={{ color: checked ? 'var(--frosted-cyan-text)' : 'var(--frosted-text-secondary)' }}>
          {label}
        </span>
      )}
    </label>
  );
};

interface CrystalRadioProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

const CrystalRadio: React.FC<CrystalRadioProps> = ({ checked, onChange, label }) => {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      {/* 外框 - 柱子光泽度 (与 Toggle 轨道一致) */}
      <div
        className="relative w-5 h-5 rounded-full overflow-hidden transition-all duration-150"
        style={{
          background: checked 
            ? 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(6, 182, 212, 0.6) 20%, rgba(6, 182, 212, 0.6) 80%, rgba(8, 145, 178, 0.8) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, var(--frosted-bg-subtle) 20%, var(--frosted-bg-subtle) 80%, rgba(0,0,0,0.06) 100%)',
          border: checked
            ? '1px solid rgba(6, 182, 212, 0.6)'
            : '1px solid var(--frosted-border-default)',
          boxShadow: checked
            ? '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 -1px 3px rgba(0,0,0,0.12) inset, 0 2px 8px rgba(6, 182, 212, 0.35), 0 0 16px rgba(6, 182, 212, 0.25)'
            : '0 1px 0 0 rgba(255,255,255,0.5) inset, 0 -1px 3px rgba(0,0,0,0.1) inset, 0 2px 4px rgba(0,0,0,0.1)',
        }}
        onClick={onChange}
      >
        {/* 柱子顶部光泽层 */}
        <div
          className="absolute top-0.5 left-1 right-1 h-1/3 rounded-t-full pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 100%)',
          }}
        />
        
        {/* 水晶珠子 - 中心圆点 (与 Toggle Knob 一致) */}
        {checked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-2.5 h-2.5 rounded-full relative"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #22d3ee 35%, #06b6d4 100%)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.4) inset, 0 0 10px rgba(6, 182, 212, 0.3)',
              }}
            >
              {/* 珠子主高光 */}
              <div
                className="absolute top-0.5 left-0.5 w-0.5 h-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                }}
              />
              {/* 珠子次高光 */}
              <div
                className="absolute bottom-0.5 right-0.5 w-0.5 h-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.5)',
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          </div>
        )}
      </div>
      {label && (
        <span className="text-sm transition-colors duration-150" style={{ color: checked ? 'var(--frosted-cyan-text)' : 'var(--frosted-text-secondary)' }}>
          {label}
        </span>
      )}
    </label>
  );
};

// ============================================
// Section 3: Sidebar
// ============================================

const SidebarSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Recipe');
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [radio1, setRadio1] = useState(false);
  const [radio2, setRadio2] = useState(true);
  
  const items = [
    { icon: Home, label: 'Home' },
    { icon: Folder, label: 'Working' },
    { icon: Settings, label: 'Production' },
    { icon: Menu, label: 'System' },
    { icon: FileText, label: 'Recipe', active: true },
    { icon: FileText, label: 'Report' },
    { icon: HelpCircle, label: 'Request' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          3. Sidebar / Navigation
        </h2>
        <span className="frosted-badge frosted-badge-green">Navigation</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Demo - 改进版 */}
        <div 
          className="w-56 frosted-card frosted-highlight"
          style={{ padding: '12px' }}
        >
          <ul className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.label;
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-3 px-3 rounded-lg cursor-pointer transition-all duration-200"
                  style={{ 
                    height: '40px',
                    background: isActive 
                      ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)' 
                      : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(6, 182, 212, 0.3)' 
                      : '1px solid transparent',
                    boxShadow: isActive
                      ? '0 1px 0 0 rgba(255,255,255,0.3) inset, 0 -1px 2px rgba(0,0,0,0.03) inset'
                      : 'none',
                    color: isActive ? 'var(--frosted-cyan-text)' : 'var(--frosted-text-secondary)',
                  }}
                  onClick={() => setActiveItem(item.label)}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-1 rounded-full" style={{ background: 'var(--frosted-cyan-text)' }} />
                  )}
                </li>
              );
            })}
          </ul>
          
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--frosted-border-subtle)' }}>
            <button className="w-full frosted-button frosted-button-purple text-sm" style={{ height: '36px' }}>
              <Plus size={16} className="mr-2" />
              CREATE
            </button>
          </div>
        </div>

        {/* Checkbox & Radio Demo */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Checkbox Section */}
          <div className="frosted-card space-y-4">
            <h4 className="text-sm font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
              Checkboxes
            </h4>
            <div className="space-y-3">
              <CrystalCheckbox 
                checked={checked1} 
                onChange={setChecked1} 
                label="Unchecked"
              />
              <CrystalCheckbox 
                checked={checked2} 
                onChange={setChecked2} 
                label="Checked"
              />
            </div>
            <div className="text-xs pt-2" style={{ color: 'var(--frosted-text-tertiary)' }}>
              <div>Border: Gray</div>
              <div>Fill: Cyan Gradient</div>
              <div>Knob: Crystal Bead</div>
            </div>
          </div>

          {/* Radio Section */}
          <div className="frosted-card space-y-4">
            <h4 className="text-sm font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
              Radio Buttons
            </h4>
            <div className="space-y-3">
              <CrystalRadio 
                checked={radio1} 
                onChange={() => { setRadio1(true); setRadio2(false); }} 
                label="Unchecked"
              />
              <CrystalRadio 
                checked={radio2} 
                onChange={() => { setRadio1(false); setRadio2(true); }} 
                label="Checked"
              />
            </div>
            <div className="text-xs pt-2" style={{ color: 'var(--frosted-text-tertiary)' }}>
              <div>Border: Gray</div>
              <div>Fill: Cyan Gradient</div>
              <div>Dot: Crystal Bead</div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog Demo */}
        <div className="frosted-modal frosted-highlight" style={{ maxWidth: '280px', position: 'relative' }}>
          <button className="absolute top-4 right-4" style={{ color: 'var(--frosted-text-tertiary)' }}>
            <X size={18} />
          </button>
          <h4 style={{ color: 'var(--frosted-text-primary)', fontWeight: 600, marginBottom: '8px' }}>
            Confirmation
          </h4>
          <p style={{ color: 'var(--frosted-text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            Are you sure you want to proceed?
          </p>
          <div className="flex gap-3 justify-end">
            <button className="frosted-button text-sm" style={{ height: '36px' }}>
              Cancel
            </button>
            <button className="frosted-button frosted-button-cyan text-sm" style={{ height: '36px' }}>
              Confirm
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Material</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>3D Frosted Glass</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Shadow</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>0 2px 6px rgba(0,0,0,0.18)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Width</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>240px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Item Height</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>40px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Selected</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>Gradient + Border</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Speed Input - 速度线输入框
// ============================================

interface SpeedInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const SpeedInput: React.FC<SpeedInputProps> = ({ placeholder, value, onChange, label }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          className="block text-xs font-medium"
          style={{ color: 'var(--frosted-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="speed-input w-full h-10 px-3 text-sm bg-transparent outline-none transition-all duration-150 rounded-lg"
          style={{
            color: 'var(--frosted-text-primary)',
            border: '1px solid var(--frosted-border-default)',
          }}
        />
        {/* 底部速度线 */}
        <div
          className="speed-line-input absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-200 ease-out pointer-events-none"
          style={{
            background: 'var(--frosted-cyan-text)',
            width: isFocused || value ? 'calc(100% - 24px)' : '0%',
            opacity: isFocused || value ? 1 : 0,
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
          }}
        />
        <style>{`
          .speed-input:focus {
            border-color: var(--frosted-border-emphasis);
            background: var(--frosted-bg-subtle);
          }
          .speed-input::placeholder {
            color: var(--frosted-text-tertiary);
          }
        `}</style>
      </div>
    </div>
  );
};

// ============================================
// Speed Select - 速度线选择框
// ============================================

interface SpeedSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
}

const SpeedSelect: React.FC<SpeedSelectProps> = ({ value, onChange, options, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5">
      {label && (
        <label 
          className="block text-xs font-medium"
          style={{ color: 'var(--frosted-text-secondary)' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className="speed-select w-full h-10 px-3 flex items-center justify-between cursor-pointer rounded-lg transition-all duration-150"
          style={{
            border: '1px solid var(--frosted-border-default)',
            color: value ? 'var(--frosted-text-primary)' : 'var(--frosted-text-tertiary)',
          }}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsFocused(true)}
          onMouseLeave={() => !isOpen && setIsFocused(false)}
        >
          <span className="text-sm">{value || placeholder}</span>
          <ChevronRight 
            size={14} 
            className="transition-transform duration-150"
            style={{ 
              color: 'var(--frosted-text-tertiary)',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </div>
        {/* 底部速度线 */}
        <div
          className="speed-line-select absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-200 ease-out pointer-events-none"
          style={{
            background: 'var(--frosted-cyan-text)',
            width: isFocused || isOpen || value ? 'calc(100% - 24px)' : '0%',
            opacity: isFocused || isOpen || value ? 1 : 0,
            boxShadow: '0 0 8px rgba(6, 182, 212, 0.4)',
          }}
        />
        
        {/* 下拉菜单 */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 py-1 rounded-lg z-10"
            style={{
              background: 'var(--frosted-bg-default)',
              border: '1px solid var(--frosted-border-default)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {options.map((option) => (
              <div
                key={option}
                className="relative flex items-center h-9 px-3 cursor-pointer transition-all duration-150 text-sm"
                style={{
                  color: option === value ? 'var(--frosted-cyan-text)' : 'var(--frosted-text-secondary)',
                }}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--frosted-bg-subtle)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {option}
                {/* 选中指示器 */}
                {option === value && (
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                    style={{
                      background: 'var(--frosted-cyan-text)',
                      boxShadow: '0 0 6px rgba(6, 182, 212, 0.5)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        <style>{`
          .speed-select:hover {
            border-color: var(--frosted-border-emphasis);
            background: var(--frosted-bg-subtle);
          }
        `}</style>
      </div>
    </div>
  );
};

// ============================================
// Section 4: Form / Input Fields
// ============================================

const FormSection: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [radioValue, setRadioValue] = useState('option1');

  const roles = ['Admin', 'Editor', 'Viewer', 'Guest'];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          4. Form / Input Fields
        </h2>
        <span className="frosted-badge frosted-badge-orange">Input</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form Demo */}
        <div className="frosted-card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <SpeedInput
              label="Username"
              placeholder="Enter name"
              value={username}
              onChange={setUsername}
            />
            <SpeedInput
              label="Email"
              placeholder="Enter email"
              value={email}
              onChange={setEmail}
            />
          </div>

          <SpeedSelect
            label="Role"
            placeholder="Select role..."
            value={role}
            onChange={setRole}
            options={roles}
          />

          <div className="pt-2 space-y-3">
            <div className="text-xs font-medium" style={{ color: 'var(--frosted-text-secondary)' }}>
              Options
            </div>
            <div className="flex gap-6">
              <CrystalCheckbox 
                checked={checked1} 
                onChange={setChecked1} 
                label="Enable feature"
              />
              <CrystalCheckbox 
                checked={checked2} 
                onChange={setChecked2} 
                label="Auto save"
              />
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <div className="text-xs font-medium" style={{ color: 'var(--frosted-text-secondary)' }}>
              Type
            </div>
            <div className="flex gap-6">
              <CrystalRadio 
                checked={radioValue === 'option1'} 
                onChange={() => setRadioValue('option1')} 
                label="Personal"
              />
              <CrystalRadio 
                checked={radioValue === 'option2'} 
                onChange={() => setRadioValue('option2')} 
                label="Business"
              />
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="frosted-card" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--frosted-text-primary)' }}>
            Speed Input 设计规格
          </h4>
          
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
                <div style={{ color: 'var(--frosted-text-tertiary)' }}>Effect</div>
                <div style={{ color: 'var(--frosted-text-primary)' }}>Bottom Speed Line</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
                <div style={{ color: 'var(--frosted-text-tertiary)' }}>Height</div>
                <div style={{ color: 'var(--frosted-text-primary)' }}>40px (compact)</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
                <div style={{ color: 'var(--frosted-text-tertiary)' }}>Transition</div>
                <div style={{ color: 'var(--frosted-text-primary)' }}>200ms (fast)</div>
              </div>
              <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
                <div style={{ color: 'var(--frosted-text-tertiary)' }}>Active Color</div>
                <div style={{ color: 'var(--frosted-cyan-text)' }}>Cyan Line</div>
              </div>
            </div>
            
            <div className="p-3 rounded-lg text-xs" style={{ background: 'var(--frosted-bg-transparent)' }}>
              <div className="font-medium mb-2" style={{ color: 'var(--frosted-cyan-text)' }}>
                特点
              </div>
              <ul className="space-y-1" style={{ color: 'var(--frosted-text-secondary)' }}>
                <li>• 底部速度线指示焦点状态</li>
                <li>• 输入内容时保持激活状态</li>
                <li>• 紧凑的 40px 高度设计</li>
                <li>• 与 Speed Buttons 保持一致风格</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 5: Popup / Modal
// ============================================

const ModalSection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          5. Popup / Modal Dialog
        </h2>
        <span className="frosted-badge frosted-badge-red">Overlay</span>
      </div>

      <div className="flex gap-4">
        <button 
          className="frosted-button frosted-button-cyan"
          onClick={() => setIsOpen(true)}
        >
          Open Modal
        </button>
        
        <div className="frosted-modal frosted-highlight" style={{ maxWidth: '400px', position: 'relative' }}>
          <button 
            className="absolute top-4 right-4"
            style={{ color: 'var(--frosted-text-tertiary)' }}
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
          <h4 style={{ color: 'var(--frosted-text-primary)', fontWeight: 600, marginBottom: '8px' }}>
            Confirmation
          </h4>
          <p style={{ color: 'var(--frosted-text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            Are you sure you want to proceed?
          </p>
          <div className="flex gap-3 justify-end">
            <button className="frosted-button text-sm" style={{ height: '36px' }}>
              Cancel
            </button>
            <button className="frosted-button frosted-button-cyan text-sm" style={{ height: '36px' }}>
              Confirm
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Material</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Flat White (#FFFFFF)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Blur</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>16px (xl)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Opacity</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>85% (emphasis)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Border Radius</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>20px</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 6: Table
// ============================================

/**
 * 磨砂水晶珠 Status Dot
 * 模拟朱玉质感，带有立体反光效果
 */
interface StatusDotProps {
  status: 'cyan' | 'green' | 'red' | 'orange' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

const StatusDot: React.FC<StatusDotProps> = ({ status, size = 'md', pulse = false }) => {
  const sizeMap = {
    sm: { dot: 12, glow: 4 },
    md: { dot: 16, glow: 6 },
    lg: { dot: 20, glow: 8 },
  };
  
  const { dot, glow } = sizeMap[size];
  
  // 基础颜色配置 - 模拟半透明玉石质感
  const colorConfig = {
    cyan: {
      base: '#06b6d4',
      light: '#67e8f9',
      dark: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.6)',
    },
    green: {
      base: '#22c55e',
      light: '#86efac',
      dark: '#16a34a',
      glow: 'rgba(34, 197, 94, 0.6)',
    },
    red: {
      base: '#ef4444',
      light: '#fca5a5',
      dark: '#dc2626',
      glow: 'rgba(239, 68, 68, 0.6)',
    },
    orange: {
      base: '#f97316',
      light: '#fdba74',
      dark: '#ea580c',
      glow: 'rgba(249, 115, 22, 0.6)',
    },
    purple: {
      base: '#a855f7',
      light: '#d8b4fe',
      dark: '#9333ea',
      glow: 'rgba(168, 85, 247, 0.6)',
    },
  };
  
  const colors = colorConfig[status];
  
  return (
    <div
      className={`relative inline-flex items-center justify-center ${pulse ? 'animate-pulse' : ''}`}
      style={{ width: dot + glow * 2, height: dot + glow * 2 }}
    >
      {/* 外层磨砂光晕 */}
      <div
        className="absolute rounded-full"
        style={{
          width: dot + glow,
          height: dot + glow,
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: 'blur(2px)',
        }}
      />
      
      {/* 主体珠子 - 使用径向渐变创建立体感 */}
      <div
        className="relative rounded-full"
        style={{
          width: dot,
          height: dot,
          // 模拟玉石的径向渐变：高光在左上，阴影在右下
          background: `
            radial-gradient(
              circle at 35% 35%,
              ${colors.light} 0%,
              ${colors.base} 40%,
              ${colors.dark} 100%
            )
          `,
          // 内阴影增加深度感
          boxShadow: `
            inset -2px -2px 4px rgba(0,0,0,0.3),
            inset 2px 2px 4px rgba(255,255,255,0.4),
            0 2px 4px rgba(0,0,0,0.2),
            0 0 0 1px rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* 高光反射点 - 模拟玉石表面的光泽 */}
        <div
          className="absolute rounded-full"
          style={{
            width: dot * 0.35,
            height: dot * 0.3,
            top: dot * 0.15,
            left: dot * 0.2,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 100%)',
            filter: 'blur(0.5px)',
            transform: 'rotate(-45deg)',
          }}
        />
        
        {/* 次要高光 */}
        <div
          className="absolute rounded-full"
          style={{
            width: dot * 0.15,
            height: dot * 0.12,
            bottom: dot * 0.25,
            right: dot * 0.25,
            background: 'rgba(255,255,255,0.4)',
            filter: 'blur(1px)',
          }}
        />
      </div>
    </div>
  );
};

const TableSection: React.FC = () => {
  const data = [
    { id: '11', name: 'Flat White', status: 'cyan' as const, action: true },
    { id: '12', name: 'Nane Conury', status: 'green' as const, action: true },
    { id: '13', name: 'Altart olice', status: 'red' as const, action: true },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          6. Table / Data Table
        </h2>
        <span className="frosted-badge">Data</span>
      </div>

      <div className="frosted-card overflow-hidden" style={{ padding: 0 }}>
        <table className="frosted-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row.id}
                style={{ 
                  background: index % 2 === 1 ? 'var(--frosted-bg-subtle)' : undefined 
                }}
              >
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>
                  <StatusDot status={row.status} size="md" />
                </td>
                <td>
                  <button 
                    className="frosted-icon"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <MoreVertical size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status Dot Specs */}
      <div className="frosted-card" style={{ background: 'var(--frosted-bg-subtle)' }}>
        <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--frosted-text-primary)' }}>
          🔮 磨砂水晶珠 Status Dot 技术规格
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
            <div style={{ color: 'var(--frosted-text-tertiary)' }}>Material</div>
            <div style={{ color: 'var(--frosted-text-primary)' }}>Jade-like Crystal</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
            <div style={{ color: 'var(--frosted-text-tertiary)' }}>Rendering</div>
            <div style={{ color: 'var(--frosted-text-primary)' }}>Radial Gradient</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
            <div style={{ color: 'var(--frosted-text-tertiary)' }}>Highlight</div>
            <div style={{ color: 'var(--frosted-cyan-text)' }}>Top-Left Gloss</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
            <div style={{ color: 'var(--frosted-text-tertiary)' }}>Shadow</div>
            <div style={{ color: 'var(--frosted-text-primary)' }}>Inner + Outer</div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
            <div style={{ color: 'var(--frosted-text-tertiary)' }}>Glow</div>
            <div style={{ color: 'var(--frosted-text-primary)' }}>Soft Halo</div>
          </div>
        </div>
        
        {/* Status Dot Variants Preview */}
        <div className="mt-4 flex items-center gap-6 p-4 rounded-lg" style={{ background: 'var(--frosted-bg-transparent)' }}>
          <div className="flex items-center gap-3">
            <StatusDot status="cyan" size="sm" />
            <span className="text-xs" style={{ color: 'var(--frosted-text-secondary)' }}>sm</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusDot status="green" size="md" />
            <span className="text-xs" style={{ color: 'var(--frosted-text-secondary)' }}>md</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusDot status="red" size="lg" />
            <span className="text-xs" style={{ color: 'var(--frosted-text-secondary)' }}>lg</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusDot status="orange" size="md" />
            <span className="text-xs" style={{ color: 'var(--frosted-text-secondary)' }}>orange</span>
          </div>
          <div className="flex items-center gap-3">
            <StatusDot status="purple" size="md" pulse />
            <span className="text-xs" style={{ color: 'var(--frosted-text-secondary)' }}>pulse</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Speed Button - 横线速度动效
// ============================================

interface SpeedButtonProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'green' | 'orange' | 'red';
  onClick?: () => void;
}

const SpeedButton: React.FC<SpeedButtonProps> = ({ children, variant = 'cyan', onClick }) => {
  const colorMap = {
    cyan: { line: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
    purple: { line: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
    green: { line: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
    orange: { line: '#f97316', glow: 'rgba(249, 115, 22, 0.4)' },
    red: { line: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
  };
  const colors = colorMap[variant];

  return (
    <button
      className="relative px-4 py-1.5 text-sm font-medium rounded-md overflow-hidden transition-all duration-150 active:scale-95"
      style={{
        background: 'var(--frosted-bg-default)',
        border: `1px solid var(--frosted-border-default)`,
        color: 'var(--frosted-text-primary)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
      onClick={onClick}
    >
      <span className="relative z-10">{children}</span>
      {/* 速度线 - 默认隐藏 */}
      <div
        className="speed-line absolute bottom-0 left-0 h-0.5 transition-all duration-150 ease-out"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.line}, transparent)`,
          width: '0%',
          opacity: 0,
        }}
      />
      <style>{`
        .speed-line {
          box-shadow: 0 0 8px ${colors.glow};
        }
        button:hover .speed-line {
          width: 100% !important;
          opacity: 1 !important;
        }
        button:active .speed-line {
          height: 2px !important;
          transition-duration: 50ms !important;
        }
      `}</style>
    </button>
  );
};

// ============================================
// Ghost Button - 低调隐形
// ============================================

interface GhostButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ElementType;
}

const GhostButton: React.FC<GhostButtonProps> = ({ children, onClick, icon: Icon }) => {
  return (
    <button
      className="flex items-center gap-2 px-3 py-1.5 text-sm transition-all duration-150 rounded-md"
      style={{
        color: 'var(--frosted-text-secondary)',
        background: 'transparent',
        border: '1px solid transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--frosted-text-primary)';
        e.currentTarget.style.background = 'var(--frosted-bg-subtle)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--frosted-text-secondary)';
        e.currentTarget.style.background = 'transparent';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'scale(0.98)';
        e.currentTarget.style.background = 'var(--frosted-bg-default)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onClick={onClick}
    >
      {Icon && <Icon size={14} />}
      <span>{children}</span>
    </button>
  );
};

// ============================================
// Section 7: Buttons
// ============================================

const ButtonsSection: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          7. Buttons / Button Variants
        </h2>
        <span className="frosted-badge frosted-badge-cyan">Action</span>
      </div>

      {/* Group 1: Speed Buttons - 醒目快速 */}
      <div className="frosted-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
            ⚡ Speed Buttons - 快速响应
          </h4>
          <span className="text-xs" style={{ color: 'var(--frosted-text-tertiary)' }}>
            横线动效 · 体积小 · 150ms响应
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <SpeedButton variant="cyan">Primary</SpeedButton>
          <SpeedButton variant="purple">Secondary</SpeedButton>
          <SpeedButton variant="green">Success</SpeedButton>
          <SpeedButton variant="orange">Warning</SpeedButton>
          <SpeedButton variant="red">Danger</SpeedButton>
          <span className="mx-2" style={{ color: 'var(--frosted-border-default)' }}>|</span>
          <SpeedButton variant="cyan">Save</SpeedButton>
          <SpeedButton variant="cyan">Publish</SpeedButton>
          <SpeedButton variant="cyan">Deploy</SpeedButton>
        </div>
        
        <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div className="grid grid-cols-3 gap-4" style={{ color: 'var(--frosted-text-secondary)' }}>
            <div>Height: 32px (compact)</div>
            <div>Transition: 150ms (fast)</div>
            <div>Effect: Speed line on hover</div>
          </div>
        </div>
      </div>

      {/* Group 2: Ghost Buttons - 低调隐形 */}
      <div className="frosted-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
            👻 Ghost Buttons - 低调隐形
          </h4>
          <span className="text-xs" style={{ color: 'var(--frosted-text-tertiary)' }}>
            无背景 · 悬浮显影 · 次要操作
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-1">
          <GhostButton icon={Edit}>Edit</GhostButton>
          <GhostButton icon={Trash2}>Delete</GhostButton>
          <GhostButton icon={RefreshCw}>Refresh</GhostButton>
          <GhostButton icon={Share2}>Share</GhostButton>
          <span className="mx-2" style={{ color: 'var(--frosted-border-default)' }}>|</span>
          <GhostButton>Cancel</GhostButton>
          <GhostButton>More options</GhostButton>
          <GhostButton>Advanced</GhostButton>
        </div>
        
        <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div className="grid grid-cols-3 gap-4" style={{ color: 'var(--frosted-text-secondary)' }}>
            <div>Background: Transparent</div>
            <div>Border: None</div>
            <div>Hover: Subtle bg reveal</div>
          </div>
        </div>
      </div>

      {/* Group 3: Classic Crystal Buttons - 保留原有设计 */}
      <div className="frosted-card">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
            💎 Crystal Buttons - 水晶质感
          </h4>
          <span className="text-xs" style={{ color: 'var(--frosted-text-tertiary)' }}>
            3D厚度 · 光泽反射 · 主要操作
          </span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button className="frosted-button frosted-button-cyan frosted-highlight text-sm" style={{ height: '36px', padding: '0 16px' }}>
            <Plus size={14} className="mr-1.5" />
            Add New
          </button>
          <button className="frosted-button frosted-highlight text-sm" style={{ height: '36px', padding: '0 16px' }}>
            <Edit size={14} className="mr-1.5" />
            Edit
          </button>
          <button className="frosted-button frosted-button-red frosted-highlight text-sm" style={{ height: '36px', padding: '0 16px' }}>
            <Trash2 size={14} className="mr-1.5" />
            Delete
          </button>
          <button className="frosted-button" disabled style={{ height: '36px', padding: '0 16px' }}>
            Disabled
          </button>
        </div>
        
        <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div className="grid grid-cols-3 gap-4" style={{ color: 'var(--frosted-text-secondary)' }}>
            <div>Height: 36px (standard)</div>
            <div>Depth: 3D with gloss</div>
            <div>Effect: Lift + glow on hover</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Speed Card - 速度线卡片
// ============================================

interface SpeedCardProps {
  title: string;
  content: string;
  variant: 'cyan' | 'purple' | 'green' | 'orange';
}

const SpeedCard: React.FC<SpeedCardProps> = ({ title, content, variant }) => {
  const variantColors = {
    cyan: {
      line: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.5)',
      title: '#0891b2',
    },
    purple: {
      line: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.5)',
      title: '#9333ea',
    },
    green: {
      line: '#22c55e',
      glow: 'rgba(34, 197, 94, 0.5)',
      title: '#16a34a',
    },
    orange: {
      line: '#f97316',
      glow: 'rgba(249, 115, 22, 0.5)',
      title: '#ea580c',
    },
  };

  const colors = variantColors[variant];

  return (
    <div
      className="speed-card relative rounded-xl p-4 cursor-pointer overflow-hidden transition-all duration-150"
      style={{
        background: 'var(--frosted-bg-default)',
        border: '1px solid var(--frosted-border-default)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* 标题 */}
      <h4 
        className="font-semibold text-sm mb-2"
        style={{ color: colors.title }}
      >
        {title}
      </h4>
      
      {/* 内容 */}
      <p 
        className="text-xs leading-relaxed"
        style={{ color: 'var(--frosted-text-secondary)' }}
      >
        {content}
      </p>
      
      {/* 速度线 - 默认隐藏 */}
      <div
        className="speed-line absolute bottom-0 left-0 h-0.5 transition-all duration-150 ease-out"
        style={{
          background: `linear-gradient(90deg, transparent, ${colors.line}, transparent)`,
          width: '0%',
          opacity: 0,
          boxShadow: `0 0 8px ${colors.glow}`,
        }}
      />
      
      <style>{`
        .speed-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .speed-card:hover .speed-line {
          width: 100% !important;
          opacity: 1 !important;
        }
        .speed-card:active {
          transform: translateY(0) scale(0.98);
          transition-duration: 50ms;
        }
        .speed-card:active .speed-line {
          height: 2px !important;
        }
      `}</style>
    </div>
  );
};

const CardsSection: React.FC = () => {
  const cards = [
    {
      title: 'Title title',
      content: 'Lorem ipsum dolor sit amet, consectetur ult content content ult...',
      variant: 'cyan' as const,
    },
    {
      title: 'Title title',
      content: 'Lorem ipsum dolor sit amet, consectetur ult content content ult...',
      variant: 'purple' as const,
    },
    {
      title: 'Title title',
      content: 'Lorem ipsum dolor sit amet, consectetur ult content content ult...',
      variant: 'green' as const,
    },
    {
      title: 'Title title',
      content: 'Lorem ipsum dolor sit amet, consectetur ult content content ult...',
      variant: 'orange' as const,
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          8. Cards / Content Container
        </h2>
        <span className="frosted-badge frosted-badge-purple">Container</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <SpeedCard
            key={index}
            title={card.title}
            content={card.content}
            variant={card.variant}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Material</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>3D Frosted Glass</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Depth</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>3-4mm</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Border Radius</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>12px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Color Tints</div>
          <div>
            <span style={{ color: 'var(--frosted-cyan-text)' }}>Cyan</span>
            {', '}
            <span style={{ color: 'var(--frosted-purple-text)' }}>Purple</span>
            {', '}
            <span style={{ color: 'var(--frosted-green-text)' }}>Green</span>
            {', '}
            <span style={{ color: 'var(--frosted-orange-text)' }}>Orange</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Speed List Item - 速度线列表项
// ============================================

interface SpeedListItemProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const SpeedListItem: React.FC<SpeedListItemProps> = ({ label, isSelected, onClick }) => {
  return (
    <div
      className="speed-list-item relative flex items-center px-3 h-10 cursor-pointer overflow-hidden transition-all duration-150 rounded-lg"
      style={{
        background: isSelected ? 'var(--frosted-cyan-bg)' : 'transparent',
        color: isSelected ? 'var(--frosted-cyan-text)' : 'var(--frosted-text-secondary)',
      }}
      onClick={onClick}
    >
      <span className="text-sm font-medium relative z-10">{label}</span>
      
      {/* 速度线 - 左侧指示器 */}
      <div
        className="speed-line-left absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full transition-all duration-150 ease-out"
        style={{
          background: 'var(--frosted-cyan-text)',
          height: isSelected ? '60%' : '0%',
          opacity: isSelected ? 1 : 0,
          boxShadow: '0 0 6px rgba(6, 182, 212, 0.5)',
        }}
      />
      
      <style>{`
        .speed-list-item:hover {
          background: var(--frosted-bg-subtle);
          color: var(--frosted-text-primary);
        }
        .speed-list-item:hover .speed-line-left {
          height: 40% !important;
          opacity: 0.5 !important;
        }
        .speed-list-item:active {
          transform: scale(0.99);
          transition-duration: 50ms;
        }
      `}</style>
    </div>
  );
};

// ============================================
// Section 9: List / Menu
// ============================================

const ListSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Item 2');
  
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          9. List / Menu
        </h2>
        <span className="frosted-badge frosted-badge-green">Navigation</span>
      </div>

      <div className="frosted-card" style={{ maxWidth: '240px', padding: '8px' }}>
        <div className="space-y-1">
          {items.map((item) => (
            <SpeedListItem
              key={item}
              label={item}
              isSelected={activeItem === item}
              onClick={() => setActiveItem(item)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Effect</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Speed Line Left</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Item Height</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>40px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Transition</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>150ms (fast)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Active</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>Cyan Background</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 10: Badges / Tags
// ============================================

const BadgesSection: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          10. Badges / Tags
        </h2>
        <span className="frosted-badge frosted-badge-orange">Status</span>
      </div>

      <div className="frosted-card">
        <div className="flex flex-wrap gap-3">
          <span className="frosted-badge frosted-badge-cyan">New</span>
          <span className="frosted-badge frosted-badge-purple">Featured</span>
          <span className="frosted-badge frosted-badge-green">Active</span>
          <span className="frosted-badge frosted-badge-orange">Pending</span>
          <span className="frosted-badge frosted-badge-red">Urgent</span>
          <span className="frosted-badge">Default</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Material</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>3D Frosted Class</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Height</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>24px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Border Radius</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>12px (pill)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Tints</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>All variants</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 11: Tabs
// ============================================

const TabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Active Tab');
  const tabs = ['Container', 'Active Tab', 'Active Tab', 'Active Tab'];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          11. Tabs / Navigation Tabs
        </h2>
        <span className="frosted-badge">Navigation</span>
      </div>

      <div className="frosted-card">
        <div className="frosted-tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                className={`frosted-tab ${isActive ? 'frosted-tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Container</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Flat White (#FFFFFF)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Active Tab</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>3D Frosted + Cyan tint</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Height</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>40px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Radius</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>8px</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 12: Toggle / Switch
// ============================================

const ToggleSection: React.FC = () => {
  const [isOn, setIsOn] = useState(true);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          12. Toggle / Switch
        </h2>
        <span className="frosted-badge frosted-badge-cyan">Control</span>
      </div>

      <div className="frosted-card flex items-center gap-8">
        <div 
          className={`frosted-toggle ${isOn ? 'frosted-toggle-active' : ''}`}
          onClick={() => setIsOn(!isOn)}
        >
          <div className="frosted-toggle-knob" />
        </div>
        
        <div className="flex items-center gap-3">
          <span style={{ color: 'var(--frosted-text-secondary)' }}>
            {isOn ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Track</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Flat Gray (#E5E7EB)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Active Track</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>Cyan Tint</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Knob</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>3D Frosted Sphere</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Size</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>48px × 26px</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Speed Dropdown Item - 速度线下拉项
// ============================================

interface SpeedDropdownItemProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const SpeedDropdownItem: React.FC<SpeedDropdownItemProps> = ({ label, isSelected, onClick }) => {
  return (
    <div
      className="speed-dropdown-item relative flex items-center h-10 px-4 cursor-pointer overflow-hidden transition-all duration-150"
      style={{
        color: isSelected ? 'var(--frosted-cyan-text)' : 'var(--frosted-text-secondary)',
      }}
      onClick={onClick}
    >
      <span className="text-sm relative z-10">{label}</span>
      
      {/* 速度线 - 底部指示器 */}
      <div
        className="speed-line-bottom absolute bottom-0 left-4 right-4 h-0.5 rounded-full transition-all duration-150 ease-out"
        style={{
          background: 'var(--frosted-cyan-text)',
          width: isSelected ? 'calc(100% - 32px)' : '0%',
          opacity: isSelected ? 1 : 0,
          boxShadow: '0 0 6px rgba(6, 182, 212, 0.5)',
        }}
      />
      
      <style>{`
        .speed-dropdown-item:hover {
          background: var(--frosted-bg-subtle);
          color: var(--frosted-text-primary);
        }
        .speed-dropdown-item:hover .speed-line-bottom {
          width: calc(100% - 32px) !important;
          opacity: 0.4 !important;
        }
        .speed-dropdown-item:active {
          background: var(--frosted-cyan-bg);
          transition-duration: 50ms;
        }
        .speed-dropdown-item:active .speed-line-bottom {
          opacity: 1 !important;
          height: 2px !important;
        }
      `}</style>
    </div>
  );
};

// ============================================
// Section 13: Dropdown / Select
// ============================================

const DropdownSection: React.FC = () => {
  const [selected, setSelected] = useState('Selected Item 1');
  const items = ['Selected Item 1', 'Selected Item 2', 'Selected Item 3'];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          13. Dropdown / Select
        </h2>
        <span className="frosted-badge frosted-badge-purple">Input</span>
      </div>

      <div className="flex gap-6">
        {/* Speed Dropdown */}
        <div 
          className="rounded-xl overflow-hidden"
          style={{
            background: 'var(--frosted-bg-default)',
            border: '1px solid var(--frosted-border-default)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            minWidth: '180px',
          }}
        >
          <div 
            className="px-4 py-2 text-xs font-medium"
            style={{ color: 'var(--frosted-text-tertiary)', borderBottom: '1px solid var(--frosted-border-subtle)' }}
          >
            Dropdown
          </div>
          {items.map((item) => (
            <SpeedDropdownItem
              key={item}
              label={item}
              isSelected={selected === item}
              onClick={() => setSelected(item)}
            />
          ))}
        </div>

        <div className="flex-1">
          <div 
            className="frosted-input flex items-center justify-between cursor-pointer transition-all duration-150"
            style={{ height: '40px' }}
          >
            <span style={{ color: 'var(--frosted-text-secondary)' }}>Select Option</span>
            <ChevronRight size={16} className="-rotate-90" style={{ color: 'var(--frosted-text-tertiary)' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Effect</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Speed Line Bottom</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Item Height</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>40px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Transition</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>150ms (fast)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Active</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>Cyan Line + BG</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 14: Progress Bar
// ============================================

const ProgressSection: React.FC = () => {
  const [progress, setProgress] = useState(80);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          14. Progress Bar / Loader
        </h2>
        <span className="frosted-badge frosted-badge-green">Feedback</span>
      </div>

      <div className="frosted-card space-y-4">
        <div className="frosted-progress">
          <div 
            className="frosted-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--frosted-text-secondary)' }}>{progress}%</span>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-48"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Track</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Flat Light Gray (#E5E7EB)</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Fill</div>
          <div style={{ color: 'var(--frosted-cyan-text)' }}>3D Frosted + Cyan</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Height</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>8px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Glow</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Yes (when active)</div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// Section 15: Icons
// ============================================

const IconsSection: React.FC = () => {
  const icons = [
    Home, Settings, User, Search, Bell, Heart, Star, Bookmark,
    Share2, Download, Upload, RefreshCw, FileText, Folder, Image,
    Music, Video, Calendar, Mail, CheckCircle, AlertCircle, Info,
    AlertTriangle, HelpCircle, Loader2, Plus, X, Edit, Trash2,
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          15. Icons / Icon System
        </h2>
        <span className="frosted-badge frosted-badge-cyan">Visual</span>
      </div>

      <div className="frosted-card">
        <div className="grid grid-cols-7 md:grid-cols-14 gap-3">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className="frosted-icon cursor-pointer"
              style={{ width: '44px', height: '44px' }}
            >
              <Icon size={20} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Library</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>Lucide React v0.487.0</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Sizes</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>16px, 20px, 24px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Container</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>40px × 40px</div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
          <div style={{ color: 'var(--frosted-text-tertiary)' }}>Style</div>
          <div style={{ color: 'var(--frosted-text-primary)' }}>3D Frosted Glass</div>
        </div>
      </div>

      <div className="p-4 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
        <h5 className="text-sm font-semibold mb-2" style={{ color: 'var(--frosted-text-primary)' }}>
          安装依赖
        </h5>
        <code className="text-xs block" style={{ color: 'var(--frosted-cyan-text)' }}>
          npm install lucide-react@^0.487.0
        </code>
      </div>
    </section>
  );
};

// ============================================
// Section 16: Crystal Glass Design Principles
// ============================================

const CrystalGlassPrinciplesSection: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold" style={{ color: 'var(--frosted-text-primary)' }}>
          16. Crystal Glass Design Principles
        </h2>
        <span className="frosted-badge frosted-badge-purple">Design</span>
      </div>

      {/* 设计原理说明 */}
      <div className="frosted-card frosted-highlight">
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--frosted-text-primary)' }}>
          💎 Crystal Glass 水晶玻璃设计理念
        </h3>
        <p className="mb-4" style={{ color: 'var(--frosted-text-secondary)' }}>
          Crystal Glass 是 Glassmorphism（玻璃拟态）与 Skeuomorphism（拟物化）的高级结合，
          模拟真实世界中半透明材质（如磨砂水晶、玉石、果冻）的质感。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* 材质特征 */}
          <div className="space-y-4">
            <h4 className="font-medium" style={{ color: 'var(--frosted-cyan-text)' }}>
              核心材质特征
            </h4>
            <div className="space-y-3">
              {[
                { icon: '🔮', title: '透光性', desc: 'backdrop-filter: blur() 实现背景模糊透出' },
                { icon: '✨', title: '光泽度', desc: '径向渐变 + 高光反射模拟立体感' },
                { icon: '📐', title: '厚度感', desc: '多层阴影 + 内阴影创造 3D 深度' },
                { icon: '🌈', title: '折射感', desc: '半透明边框 + 高光模拟光学效果' },
              ].map((item) => (
                <div 
                  key={item.title}
                  className="flex items-start gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--frosted-bg-subtle)' }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm" style={{ color: 'var(--frosted-text-primary)' }}>
                      {item.title}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--frosted-text-secondary)' }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 技术实现 */}
          <div className="space-y-4">
            <h4 className="font-medium" style={{ color: 'var(--frosted-purple-text)' }}>
              技术实现层
            </h4>
            <div className="p-4 rounded-lg" style={{ background: 'var(--frosted-bg-subtle)' }}>
              <code className="text-xs block space-y-2" style={{ color: 'var(--frosted-cyan-text)' }}>
{`/* 1. 基础磨砂层 */
backdrop-filter: blur(12px) saturate(150%);

/* 2. 3D 厚度 - 多层阴影 */
box-shadow: 
  /* 顶部高光 */
  0 1px 0 0 rgba(255,255,255,0.6) inset,
  /* 底部阴影 */
  0 -2px 4px rgba(0,0,0,0.05) inset,
  /* 外部投影 */
  0 4px 6px rgba(0,0,0,0.1);

/* 3. 光泽反射 - 径向渐变 */
background: radial-gradient(
  circle at 30% 30%,
  rgba(255,255,255,0.9) 0%,
  var(--color) 40%,
  rgba(0,0,0,0.1) 100%
);`}
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* 组件效果对比展示 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Button Demo */}
        <div className="frosted-card text-center space-y-4">
          <h4 className="text-sm font-medium" style={{ color: 'var(--frosted-text-primary)' }}>
            Crystal Button
          </h4>
          <div className="flex justify-center gap-2">
            <button className="frosted-button frosted-button-cyan frosted-highlight text-sm">
              Primary
            </button>
            <button className="frosted-button frosted-highlight text-sm">
              Default
            </button>
          </div>
          <p className="text-xs" style={{ color: 'var(--frosted-text-tertiary)' }}>
            3D 厚度 + 光泽反射 + 悬浮效果
          </p>
        </div>

        {/* Tab Demo */}
        <div className="frosted-card text-center space-y-4">
          <h4 className="text-sm font-medium" style={{ color: 'var(--frosted-text-primary)' }}>
            Crystal Tab
          </h4>
          <div className="frosted-tabs" style={{ margin: '0 auto' }}>
            <button className="frosted-tab">Tab 1</button>
            <button className="frosted-tab frosted-tab-active">Active</button>
            <button className="frosted-tab">Tab 3</button>
          </div>
          <p className="text-xs" style={{ color: 'var(--frosted-text-tertiary)' }}>
            立体 Active 状态 + 多层高光
          </p>
        </div>

        {/* Toggle Demo */}
        <div className="frosted-card text-center space-y-4">
          <h4 className="text-sm font-medium" style={{ color: 'var(--frosted-text-primary)' }}>
            Crystal Toggle
          </h4>
          <div className="flex justify-center gap-4">
            <div className="frosted-toggle">
              <div className="frosted-toggle-knob" />
            </div>
            <div className="frosted-toggle frosted-toggle-active">
              <div className="frosted-toggle-knob" />
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--frosted-text-tertiary)' }}>
            柱子光泽度 + 水晶珠子开关
          </p>
        </div>
      </div>

      {/* 设计灵感 */}
      <div className="frosted-card" style={{ background: 'var(--frosted-bg-subtle)' }}>
        <h4 className="font-medium mb-3" style={{ color: 'var(--frosted-text-primary)' }}>
          🎨 设计灵感来源
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {[
            { name: 'iOS Control Center', desc: '磨砂玻璃背景' },
            { name: 'macOS Big Sur', desc: '半透明标题栏' },
            { name: 'VisionOS', desc: '空间玻璃质感' },
            { name: 'Apple Watch Ultra', desc: '立体按钮效果' },
          ].map((item) => (
            <div 
              key={item.name}
              className="p-3 rounded-lg text-center"
              style={{ background: 'var(--frosted-bg-transparent)' }}
            >
              <div className="font-medium" style={{ color: 'var(--frosted-text-primary)' }}>
                {item.name}
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--frosted-text-tertiary)' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// Dependencies Documentation Panel
// ============================================

const DependenciesPanel: React.FC = () => {
  const dependencies = [
    { name: 'react', version: '^18.3.1', purpose: '核心 UI 库' },
    { name: 'react-dom', version: '^18.3.1', purpose: 'DOM 渲染' },
    { name: 'lucide-react', version: '^0.487.0', purpose: '图标系统' },
    { name: 'tailwindcss', version: '^3.x', purpose: 'CSS 工具类' },
    { name: 'clsx', version: '*', purpose: '类名合并' },
    { name: 'tailwind-merge', version: '*', purpose: 'Tailwind 类合并' },
  ];

  return (
    <div className="frosted-card" style={{ background: 'var(--frosted-bg-subtle)' }}>
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--frosted-text-primary)' }}>
        📦 依赖包清单
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--frosted-text-tertiary)' }}>
              <th className="text-left py-2">包名</th>
              <th className="text-left py-2">版本</th>
              <th className="text-left py-2">用途</th>
              <th className="text-left py-2">安装命令</th>
            </tr>
          </thead>
          <tbody style={{ color: 'var(--frosted-text-secondary)' }}>
            {dependencies.map((dep) => (
              <tr key={dep.name} style={{ borderTop: '1px solid var(--frosted-border-subtle)' }}>
                <td className="py-3 font-medium" style={{ color: 'var(--frosted-cyan-text)' }}>
                  {dep.name}
                </td>
                <td className="py-3">{dep.version}</td>
                <td className="py-3">{dep.purpose}</td>
                <td className="py-3">
                  <code className="text-xs px-2 py-1 rounded" style={{ background: 'var(--frosted-bg-default)' }}>
                    npm i {dep.name}@{dep.version.replace(/^[\^~]/, '')}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// Main Showcase Component
// ============================================

const FrostedMaterialShowcase: React.FC = () => {
  return (
    <ThemeProvider>
      <div 
        className="min-h-screen p-6 md:p-8"
        style={{ 
          background: 'var(--frosted-surface-bg-gradient)',
          transition: 'background 0.3s ease'
        }}
      >
        {/* Header */}
        <header className="frosted-glass-emphasis frosted-highlight rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: 'var(--frosted-text-primary)' }}
              >
                Frosted Material UI Component Library
              </h1>
              <p style={{ color: 'var(--frosted-text-secondary)' }}>
                磨砂玻璃质感设计系统 · 支持亮暗双模式 · 完整的组件文档
              </p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Dependencies Panel */}
        <div className="mb-8">
          <DependenciesPanel />
        </div>

        {/* Component Sections */}
        <div className="space-y-12">
          <MainPanelSection />
          <HeaderSection />
          <SidebarSection />
          <FormSection />
          <ModalSection />
          <TableSection />
          <ButtonsSection />
          <CardsSection />
          <ListSection />
          <BadgesSection />
          <TabsSection />
          <ToggleSection />
          <DropdownSection />
          <ProgressSection />
          <IconsSection />
          <CrystalGlassPrinciplesSection />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 pb-8 text-center" style={{ borderTop: '1px solid var(--frosted-border-default)' }}>
          <p style={{ color: 'var(--frosted-text-tertiary)' }}>
            Frosted Material UI Component Library v1.0.0
          </p>
          <p className="text-sm mt-2" style={{ color: 'var(--frosted-text-tertiary)' }}>
            Built with React + Tailwind CSS + backdrop-filter
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default FrostedMaterialShowcase;
