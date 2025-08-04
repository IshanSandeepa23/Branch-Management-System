// Utility for saving and loading settings from localStorage or backend
export const saveSettings = (settings) => {
  localStorage.setItem('bms_settings', JSON.stringify(settings));
};

export const loadSettings = () => {
  const data = localStorage.getItem('bms_settings');
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
