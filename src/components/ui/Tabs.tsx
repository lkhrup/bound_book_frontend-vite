import classNames from "classnames";

interface TabsProps {
  tabs: Tab[];
  active: string;
  setActive: (key: string) => void;
}

interface Tab {
  key: string;
  label: string;
}

export function Tabs({ tabs, active, setActive }: TabsProps) {
  return (
    <div
      className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-3">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <li key={tab.key} className="me-2">
            <a onClick={() => setActive(tab.key)}
               className={classNames(
                 "inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-800 hover:border-gray-400 dark:hover:text-gray-300",
                 active === tab.key ?
                   "active text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500" :
                   "text-gray-600 border-transparent"
               )}>
              {tab.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}