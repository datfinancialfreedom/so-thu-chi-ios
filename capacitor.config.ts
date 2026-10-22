import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'vn.sothuchi.app',
  appName: 'Sổ Thu Chi',
  webDir: 'www',
  ios: {
    // Hiển thị nội dung tràn tới mép màn hình (tai thỏ / Dynamic Island)
    contentInset: 'always',
    // Không dùng scroll view bao ngoài của iOS, để web app tự cuộn
    scrollEnabled: false
  },
  server: {
    // Không load từ server ngoài: toàn bộ app nằm trong thư mục www/ của chính app
    androidScheme: 'https'
  }
};

export default config;
