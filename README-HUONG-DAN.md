# Sổ Thu Chi — Gói iOS (Capacitor) để tự ký

Gói này biến web app **Sổ Thu Chi** (quản lý tài chính cá nhân, tiếng Việt, tiền VNĐ) thành một app iOS bằng **Capacitor**.

Bên trong app là bản web tự chứa trong thư mục `www/` — chạy **không cần máy chủ**, dữ liệu lưu bằng **localStorage ngay trên iPhone**. Gồm: tổng quan số dư/thu/chi tháng, thêm/sửa/xoá giao dịch theo danh mục và ví (3 ví mặc định: Tiền mặt, Ngân hàng, Ví điện tử), ngân sách theo danh mục, mục tiêu tiết kiệm, và mục **Tài sản**: vàng (theo chỉ, giá mua/giá hiện tại, lãi/lỗ), sổ tiết kiệm và chứng chỉ tiền gửi (gốc, lãi suất %/năm, ngày gửi, kỳ hạn tháng, ngày đáo hạn, lãi ước tính). App bắt đầu **trống, không có dữ liệu giao dịch mẫu**.

> ⚠️ **Việc ký app là của chính bạn, bằng Apple ID của bạn.** Đừng bao giờ chia sẻ khóa bí mật (private key), file `.p12`, mật khẩu Apple ID hay mã xác thực 2 lớp cho bất kỳ ai — kể cả người làm giúp. Ai có những thứ đó đều có thể ký app mạo danh bạn.

---

## KHÔNG CÓ MAC THÌ LÀM SAO?

Không có Mac **không có nghĩa là không dùng được**. Có 4 đường, xếp từ dễ nhất tới cầu kỳ nhất:

### a) Dễ nhất, khuyên dùng trước: bản web cài ra màn hình chính — không cần Mac, không cần chứng chỉ

Web app và app iOS đóng gói trong gói này dùng chung một giao diện và tính năng lõi. Nếu mục đích chỉ là “có icon ngoài màn hình chính, mở lên dùng như app”, bản web làm được ngay:

1. Mở bản web Sổ Thu Chi bằng **Safari** trên iPhone (bắt buộc dùng Safari, không dùng Chrome).
2. Bấm nút **Chia sẻ** (hình vuông có mũi tên lên).
3. Chọn **Thêm vào Màn hình chính (Add to Home Screen)** → **Thêm**.
4. Từ giờ bấm icon ngoài màn hình chính là mở app toàn màn hình, không còn thanh địa chỉ.

- Không cần máy tính, không cần Apple ID nhà phát triển, **không hết hạn 7 ngày**.
- Dữ liệu lưu trên chính iPhone đó. Nhược điểm: không có trên App Store, và nếu xoá dữ liệu Safari / gỡ icon thì dữ liệu trong đó cũng mất — hãy dùng nút **Xuất sao lưu (JSON)** trong tab *Thêm* của app để sao lưu định kỳ.

**Nếu chưa thật sự cần file `.ipa`, hãy dừng ở cách này.**

### b) Dùng GitHub Actions làm “Mac đám mây” miễn phí để build file (chưa ký)

GitHub cho chạy máy ảo **macOS** trên đám mây. Gói này đã có sẵn file workflow `.github/workflows/build-ios.yml` để build tự động. Kết quả là file **`.ipa` chưa ký** — đây là “nguyên liệu”, **chưa cài thẳng lên iPhone được**, vẫn cần bước ký ở mục (c).

**Các bước:**

1. Tạo tài khoản tại **github.com** (nếu chưa có), bấm **New repository**, đặt tên ví dụ `so-thu-chi`, chọn **Private** (riêng tư) rồi **Create repository**. Không tick “Add a README”.
2. Đẩy **toàn bộ nội dung đã giải nén của gói này** lên repo — phải có `package.json`, `capacitor.config.ts`, thư mục `www/` và đặc biệt là thư mục ẩn **`.github/workflows/build-ios.yml`**.
   - ⚠️ Kéo-thả trên web GitHub rất dễ làm sót thư mục ẩn `.github`. Cách chắc chắn nhất là dùng **GitHub Desktop** trên Windows (mở repo → *Open in GitHub Desktop* → copy file vào → Commit → Publish/Push), hoặc dùng Git:
     ```bat
     cd duong-dan-toi-thu-muc-da-giai-nen
     git init
     git add .
     git commit -m "So Thu Chi iOS"
     git branch -M main
     git remote add origin https://github.com/TEN-CUA-BAN/so-thu-chi.git
     git push -u origin main
     ```
3. Trên trang repo, vào tab **Actions**. Nếu GitHub hỏi, bấm nút cho phép chạy workflows.
4. Bên trái chọn workflow **“Build iOS (chưa ký)”** → bấm **Run workflow** → chọn nhánh `main` → **Run workflow**. (Đẩy code lên nhánh `main` cũng tự kích hoạt workflow này.)
5. Chờ job chạy trên runner `macos-latest`: cài Node → `npm install` → tự chạy `npx cap add ios` nếu chưa có thư mục `ios/` → `npx cap sync ios` → `xcodebuild` **không ký** (`CODE_SIGNING_ALLOWED=NO`) → đóng gói.
6. Mở lần chạy vừa xong, kéo xuống mục **Artifacts**, tải artifact tên **`SoThuChi-iOS-unsigned`**. Giải nén sẽ được:
   - `SoThuChi-unsigned.ipa` — file app chưa ký, dùng cho bước ký ở mục (c);
   - `SoThuChi-app.zip` — bản nén của thư mục `.app` (để dùng với Xcode/Mac nếu sau này có).
7. Artifact được giữ **14 ngày** rồi tự xoá — tải về máy và lưu lại.

**Chi phí/giới hạn:** GitHub Actions có hạn mức phút miễn phí tùy loại tài khoản và repo công khai/riêng tư; phút chạy **macOS được tính nhân hệ số cao hơn** nhiều so với Linux, nên đừng bấm chạy liên tục không cần thiết. Kiểm tra hạn mức hiện tại của tài khoản bạn trong *Settings → Billing* trên GitHub.

### c) Ký và cài file `.ipa` lên iPhone bằng máy Windows (Sideloadly hoặc AltStore/SideStore)

Đây là bước biến file `.ipa` chưa ký ở mục (b) thành app cài được, bằng **Apple ID cá nhân của bạn**. Nguyên tắc chung: công cụ sẽ ký app bằng chứng chỉ miễn phí gắn với Apple ID của bạn (**Personal Team**).

**Chuẩn bị chung (bắt buộc trên iPhone, iOS 16 trở lên):**

1. **Bật Developer Mode:** *Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển (Developer Mode)* → bật → iPhone khởi động lại → xác nhận bật.
2. Cắm cáp iPhone vào máy Windows, mở khóa iPhone và bấm **Tin cậy (Trust)** máy tính này nếu được hỏi.
3. Sau khi cài, trước khi mở app lần đầu: vào *Cài đặt → Cài đặt chung → Quản lý VPN & Thiết bị (VPN & Device Management)* → mục **Developer App** chọn Apple ID của bạn → **Tin cậy (Trust)**. Gặp lỗi “Untrusted Developer / Nhà phát triển không được tin cậy” là do chưa làm bước này.

**Cách 1 — Sideloadly (đơn giản nhất trên Windows):**

1. Tải **Sideloadly** từ trang chính thức của Sideloadly (chỉ tải ở trang chính thức, không tải bản “crack”/chia sẻ lại). Cài thêm **iTunes và iCloud bản tải từ trang Apple** (không phải bản Microsoft Store) theo đúng hướng dẫn trên trang đó.
2. Mở Sideloadly, chọn đúng iPhone của bạn, kéo file `SoThuChi-unsigned.ipa` vào cửa sổ chương trình.
3. Nhập **Apple ID của bạn** vào ô Apple ID trong Sideloadly (chỉ nhập trong app chính thức này; nếu ngại, có thể tạo một Apple ID phụ chỉ để ký app). Bấm **Start** và nhập mật khẩu/mã xác thực nếu Apple yêu cầu.
4. Chờ cài xong, làm bước “Tin cậy nhà phát triển” ở trên rồi mở app.

**Cách 2 — AltStore / SideStore:**

- **AltStore:** cài **AltServer** lên Windows → cài AltStore vào iPhone qua AltServer → trong AltStore chọn file `.ipa` để cài. AltStore có thể **tự gia hạn (refresh) app qua Wi-Fi** khi điện thoại và máy tính ở cùng mạng và AltServer đang chạy.
- **SideStore:** là bản phát triển từ AltStore, sau khi cài đặt ban đầu (cần tạo file ghép nối/pairing file theo hướng dẫn chính thức của SideStore) thì có thể tự gia hạn ngay trên iPhone mà không cần máy tính chạy liên tục.

Cả hai đều nhiều bước cài đặt ban đầu hơn Sideloadly — chỉ nên dùng nếu bạn muốn tính năng tự gia hạn.

**Giới hạn của ký miễn phí bằng Apple ID cá nhân (áp dụng cho cả Sideloadly/AltStore/SideStore):**

- ⏰ **Chứng chỉ chỉ có hiệu lực 7 ngày.** Hết 7 ngày app **sẽ không mở được nữa** cho đến khi ký lại (chạy lại Sideloadly, hoặc để AltStore/SideStore refresh). Ký lại **đúng file app, đúng Bundle ID, không gỡ app** thì dữ liệu thường được giữ nguyên; **gỡ app là mất dữ liệu localStorage** — trước mỗi lần ký lại hãy mở app (khi còn hạn) và **Xuất sao lưu (JSON)** ở tab *Thêm*.
- Tối đa khoảng **3 app ký kiểu này đang hoạt động** cùng lúc trên một máy với tài khoản miễn phí, và bị giới hạn số lượng App ID đăng ký trong 7 ngày.
- Đây là cơ chế chính thức của Apple cho nhà phát triển dùng thử trên máy của mình — **không phải** cách phát hành cho người khác.
- 🚫 **Không** mua/dùng “chứng chỉ dùng chung”, “chứng chỉ doanh nghiệp bán sẵn” hay dịch vụ ký hộ lạ: Apple thu hồi các chứng chỉ đó rất thường xuyên (app đang dùng sẽ đột ngột không mở được), và ký bằng chứng chỉ của người lạ còn là rủi ro bảo mật cho chính bạn.

### d) Thuê Mac đám mây theo giờ (ví dụ MacinCloud)

Nếu muốn trải nghiệm đúng quy trình Xcode như có Mac thật mà không mua máy:

1. Thuê một máy Mac đám mây theo giờ/gói tại một dịch vụ như **MacinCloud** (hoặc dịch vụ tương tự): đăng ký → chọn gói có Xcode → nhận thông tin đăng nhập điều khiển từ xa.
2. Kết nối vào Mac đám mây từ Windows (qua trình duyệt hoặc app điều khiển từ xa theo hướng dẫn của dịch vụ), tải gói này lên đó.
3. Làm **toàn bộ phần “KÝ BẰNG MÁY MAC THẬT” ở dưới** ngay trên Mac đám mây đó: cài Xcode/Node, `npm install`, `npx cap sync`, mở Xcode, đăng nhập Apple ID **của bạn**, chọn Personal Team, cắm/đăng ký thiết bị theo hướng dẫn của dịch vụ (việc kết nối iPhone vật lý với Mac đám mây có thể bị hạn chế — nhiều người dùng Mac đám mây chỉ để build/TestFlight thay vì cài thẳng qua cáp).
4. Dùng xong: **đăng xuất Apple ID, xoá chứng chỉ/khóa của bạn khỏi máy đó** (Keychain) và hủy gói thuê nếu không dùng nữa. Không để private key ở lại trên máy thuê.

---

## KÝ BẰNG MÁY MAC THẬT

*(Phần này giữ nguyên cho trường hợp bạn/mượn được máy Mac, hoặc dùng Mac đám mây ở mục d.)*

### 1. Điều kiện cần

- **Máy Mac** chạy macOS bản còn được Xcode hiện hành hỗ trợ.
- **Xcode** — cài miễn phí từ **App Store** (khá nặng, hãy cài trước).
- **Node.js bản LTS** — tải tại nodejs.org, hoặc cài bằng Homebrew: `brew install node`.
- **Cáp kết nối iPhone** (USB-C/Lightning đúng loại), iPhone chạy iOS 16 trở lên.
- **Apple ID** của chính bạn (dùng miễn phí với Personal Team, xem mục 4).

### 2. Giải nén và cài đặt

1. Giải nén `so-thu-chi-ios.zip`, mở app **Terminal**, đi vào thư mục vừa giải nén:
   ```bash
   cd ~/Downloads/so-thu-chi-ios
   ```
2. Cài các thư viện cần thiết:
   ```bash
   npm install
   ```
3. Nếu chưa có thư mục `ios/` (gói này chủ ý chưa tạo sẵn để bạn tạo trên đúng bản Xcode của mình):
   ```bash
   npx cap add ios
   ```
4. Đồng bộ bản web trong `www/` vào project iOS (chạy lại lệnh này **sau mỗi lần sửa** nội dung trong `www/`):
   ```bash
   npx cap sync
   ```
5. Mở project trong Xcode:
   ```bash
   npx cap open ios
   ```

### 3. Ký app trong Xcode bằng Personal Team (miễn phí)

1. Trong Xcode, nếu chưa đăng nhập: **Xcode → Settings → Accounts → dấu + → Apple ID** → đăng nhập Apple ID của bạn.
2. Ở cột trái, chọn project **App** (biểu tượng xanh trên cùng) → chọn target **App** → tab **Signing & Capabilities**.
3. Tick **Automatically manage signing**.
4. Ô **Team**: chọn **tên của bạn (Personal Team)** — đây là đội miễn phí gắn với Apple ID của bạn.
   - Không thấy Team nào? Quay lại bước 1 kiểm tra đã đăng nhập Apple ID chưa, rồi đóng/mở lại Xcode.
5. Ô **Bundle Identifier** đang là `vn.sothuchi.app`. Nếu Xcode báo trùng/đã có người dùng, đổi thành mã riêng của bạn, ví dụ `vn.sothuchi.app.le` hoặc `com.tenban.sothuchi` (chỉ dùng chữ, số, dấu chấm, gạch ngang; mỗi app một mã duy nhất).
6. Kết nối iPhone bằng cáp, mở khóa máy, bấm **Trust/Tin cậy** nếu được hỏi.
7. Trên iPhone: bật **Developer Mode** — *Cài đặt → Quyền riêng tư & Bảo mật → Chế độ nhà phát triển* → bật → máy khởi động lại → xác nhận.
8. Trên thanh công cụ Xcode, chọn **đúng iPhone của bạn** làm thiết bị chạy (không chọn Simulator), rồi bấm nút **Run ▶**.
9. Lần đầu mở app trên iPhone có thể bị chặn: vào *Cài đặt → Cài đặt chung → Quản lý VPN & Thiết bị* → chọn nhà phát triển là Apple ID của bạn → **Tin cậy** → mở lại app.

### 4. Giới hạn của ký miễn phí (Personal Team)

- ⏰ **Hết hạn sau 7 ngày:** app ngừng mở, phải cắm iPhone vào Mac và bấm **Run** lại trong Xcode (giữ nguyên app, không gỡ, thì dữ liệu được giữ).
- Giới hạn số app và số thiết bị đăng ký theo chính sách tài khoản miễn phí của Apple.
- Không đăng được lên App Store, không dùng được TestFlight.
- Chỉ phù hợp để **tự dùng trên máy của mình** trong lúc chỉnh sửa, hoàn thiện app.

### 5. Muốn dùng lâu dài: Apple Developer Program — 99 USD/năm (tóm tắt)

1. Đăng ký tại developer.apple.com bằng Apple ID của bạn, xác minh danh tính và đóng phí **99 USD/năm**.
2. Khi đó Team trong Xcode là đội trả phí của bạn: chứng chỉ có hiệu lực **1 năm**, không còn cảnh 7 ngày.
3. Hai đường phát hành chính:
   - **TestFlight:** trong Xcode chọn *Product → Archive* → *Distribute App → TestFlight & App Store* → tải bản build lên App Store Connect → mời người dùng thử qua app TestFlight (tối đa rất nhiều người thử, bản build TestFlight có hạn 90 ngày).
   - **App Store:** cũng từ bản Archive đó, tạo hồ sơ app trong App Store Connect (tên, mô tả, ảnh chụp màn hình, chính sách riêng tư), gửi xét duyệt; Apple duyệt đạt mới xuất hiện công khai trên App Store.
4. Mọi bước đăng ký/thanh toán đều làm **bằng tài khoản Apple của bạn trên trang của Apple** — không nhờ người khác đăng ký hộ bằng tài khoản của họ, vì app sẽ thuộc về họ.

---

## XỬ LÝ LỖI THƯỜNG GẶP

| Lỗi / hiện tượng | Nguyên nhân thường gặp | Cách xử lý |
|---|---|---|
| **“Untrusted Developer / Nhà phát triển không được tin cậy”** | Chưa xác nhận tin cậy trên iPhone | *Cài đặt → Cài đặt chung → Quản lý VPN & Thiết bị → Developer App → chọn Apple ID của bạn → Tin cậy* |
| **Bundle Identifier bị trùng** | Mã `vn.sothuchi.app` đã có app khác dùng (kể cả app cũ của bạn ở Team khác) | Đổi Bundle Identifier trong Xcode (Signing & Capabilities) thành mã riêng, ví dụ thêm tên của bạn ở cuối |
| **App mở lên rồi văng / báo hết hạn sau ~7 ngày** | Chứng chỉ miễn phí Personal Team hết hạn | Ký lại: có Mac thì Run lại từ Xcode; không có Mac thì ký lại bằng Sideloadly (mục c) hoặc để AltStore/SideStore refresh. Không gỡ app để giữ dữ liệu |
| **Không thấy mục chọn Team trong Xcode** | Chưa đăng nhập Apple ID vào Xcode | *Xcode → Settings → Accounts → + → Apple ID*, đăng nhập xong chọn lại project → Signing & Capabilities |
| **Xcode không thấy iPhone / không cho Run** | Chưa bật Developer Mode, chưa bấm Trust, hoặc cáp lỗi | Bật Developer Mode (có khởi động lại máy), mở khóa iPhone, bấm Tin cậy, thử cáp khác/cổng khác |
| **GitHub Actions báo đỏ ở bước build** | Lỗi trong code web hoặc thay đổi của Capacitor/Xcode trên runner | Mở log của step màu đỏ trong tab Actions để xem dòng lỗi đầu tiên; sửa trong `www/` (hoặc file cấu hình) rồi commit/push và chạy lại. Đừng chạy lại liên tục nhiều lần — tốn hạn mức phút macOS |
| **Sideloadly báo lỗi đăng nhập / yêu cầu mã** | Apple yêu cầu xác thực 2 lớp, hoặc iTunes/iCloud không đúng bản | Nhập mã xác thực Apple gửi về thiết bị tin cậy; cài iTunes/iCloud bản từ trang Apple theo hướng dẫn của Sideloadly |
| **Sửa giao diện rồi mà app không thay đổi** | Chưa đồng bộ lại web vào iOS | Chạy `npx cap sync` (hoặc build lại trên GitHub Actions) rồi cài/Run lại |
| **Mất dữ liệu sau khi cài lại** | Đã **gỡ app** trước khi cài lại, hoặc đổi Bundle ID (iOS coi là app khác) | Luôn cài đè/ký lại cùng Bundle ID, không gỡ app; sao lưu JSON thường xuyên trong tab *Thêm* của app |

## GHI NHỚ VỀ DỮ LIỆU & BẢO MẬT

- Dữ liệu của app này lưu **cục bộ trên từng thiết bị** (localStorage trong app). Bản web, bản ký bằng Mac và bản ký bằng Sideloadly là **các nơi lưu riêng biệt, không tự đồng bộ** với nhau.
- Sao lưu bằng nút **Xuất sao lưu (JSON)** trong tab *Thêm* trước khi: ký lại sau hết hạn, đổi điện thoại, đổi Bundle ID.
- Private key và file `.p12` chỉ nằm trên máy của bạn. **Không gửi cho người khác, không tải lên GitHub** (file `.gitignore` trong gói đã chặn sẵn các file này).

## CẤU TRÚC GÓI

```
so-thu-chi-ios/
├── README-HUONG-DAN.md          ← file bạn đang đọc
├── package.json                 ← Capacitor 8.5.3 (@capacitor/core, /cli, /ios)
├── capacitor.config.ts          ← appId: vn.sothuchi.app · appName: "Sổ Thu Chi" · webDir: www
├── tsconfig.json
├── .gitignore                   ← chặn node_modules, thư mục iOS sinh ra, và file chứng chỉ
├── www/
│   └── index.html               ← toàn bộ web app Sổ Thu Chi (1 file, chạy offline)
└── .github/
    └── workflows/
        └── build-ios.yml        ← build iOS không ký trên GitHub Actions (macOS)
```

*Thư mục `ios/` sẽ được tạo khi chạy `npx cap add ios` (trên Mac thật, Mac đám mây, hoặc tự động trong GitHub Actions).*
