# ⚔️ Chaos Battleground

Game hành động nhìn từ trên xuống chạy hoàn toàn trên trình duyệt: chiến dịch 50 màn, raid vô tận, đấu trường PvP (bot / 2v2 / online), 44 nhân vật để mở khoá và 6 nhân vật Bí ẩn.

## Chơi thử trên máy

Cần [Node.js](https://nodejs.org) 18 trở lên, không phải cài thêm gói nào.

**Windows:** bấm đúp file `start.bat`. Nó bật server local và tự mở game trong trình duyệt; đóng cửa sổ đen để tắt server.

Hoặc chạy bằng dòng lệnh (mọi hệ điều hành) rồi mở http://localhost:3000:

```bash
node dev-server.js
```

Server này phục vụ game và giả lập luôn `/api` giống Vercel; tài khoản thử được lưu trong `.data/db.json`. Mật khẩu admin khi chạy local nằm trong `.admin-password.txt`.

## Deploy

Push lên GitHub, Vercel tự deploy như trước (không cần build, không cần `package.json`). Thư mục `api/` được Vercel tự nhận thành serverless function.

### Bật tài khoản cloud (làm 1 lần, miễn phí)

Khi chưa làm bước này game vẫn chạy bình thường, nhưng tài khoản và tiến trình chỉ lưu trên trình duyệt của từng máy (màn hình đăng nhập sẽ ghi "💾 Lưu trên thiết bị").

1. Vào project trên [vercel.com](https://vercel.com) → tab **Storage** → **Create Database** → chọn **Upstash for Redis** (gói Free) → **Connect** vào project này.
   Vercel tự thêm biến môi trường `KV_REST_API_URL` và `KV_REST_API_TOKEN` (hoặc `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`, code nhận cả hai kiểu).
2. Vào **Settings → Environment Variables**, thêm:
   | Tên | Giá trị |
   | --- | --- |
   | `ADMIN_PASS` | mật khẩu admin bạn tự chọn (6–64 ký tự) |
   | `ADMIN_USER` | *(tuỳ chọn)* tên đăng nhập admin, mặc định `admin` |
   | `AUTH_SECRET` | *(tuỳ chọn)* chuỗi ngẫu nhiên dài để ký phiên đăng nhập |
3. **Deployments → Redeploy** để biến môi trường có hiệu lực.

Sau đó màn hình đăng nhập ghi "☁️ Lưu cloud": người chơi đăng ký một lần, đăng nhập ở máy nào cũng giữ nguyên tiến trình.

## Tài khoản admin

Đăng nhập bằng tên `admin`. Admin có sẵn cấp 50, đủ 4 chỉ số tối đa, toàn bộ nhân vật cấp 10, mở hết các màn, vàng không giới hạn, và có nút **🛠 Quản trị** trong ⚙️ Cài đặt để xem danh sách người chơi, cộng vàng, mở nhân vật, đặt lại mật khẩu, reset hoặc xoá tài khoản.

- **Trên Vercel (đã bật cloud):** mật khẩu là giá trị `ADMIN_PASS`. Chưa đặt `ADMIN_PASS` thì không ai đăng nhập được admin.
- **Khi chưa bật cloud / chạy trên máy:** mật khẩu nằm trong file `.admin-password.txt` (file này bị git bỏ qua, không lên GitHub). Đổi mật khẩu:

  ```bash
  node tools/set-admin-password.js "MatKhauMoi"
  ```

  Lệnh này ghi mã băm vào `js/config.js` (cần commit file đó) và cập nhật `.admin-password.txt`, `.env.local`.

> Lưu ý: game chạy phía trình duyệt nên server không thể kiểm chứng tiến trình là "thật". Server chỉ giữ dữ liệu đúng định dạng và trong giới hạn của game; ở chế độ lưu trên thiết bị thì mọi thứ nằm trong trình duyệt của người chơi. Điều này chấp nhận được với game cày cấp một người chơi, còn đấu PvP luôn dùng chỉ số gốc nên không bị ảnh hưởng.

## Cách game vận hành

- **Khiên & máu (kiểu Soul Knight):** khiên đỡ đòn trước và tự hồi sau 3,5 giây không trúng đòn. Hết khiên mới mất máu; máu không tự hồi, chỉ hồi bằng bình máu, chiêu hồi máu hoặc buff.
- **Chiến dịch:** 5 chương × 10 màn, màn 5 có quái tinh anh, màn 10 có boss. Qua phòng được chọn 1 trong 3 buff. Gục ngã được hồi sinh 1 lần bằng vàng.
- **Raid vô tận:** mở sau màn 1-3; mỗi tầng 5 phòng (phòng 3 kho báu, phòng 5 boss), càng lên càng khó.
- **Lên cấp:** qua màn / raid nhận XP. Mỗi cấp cho 1 điểm để cộng Máu, Khiên, Sát thương, Tốc độ (tối đa 20 mỗi loại, cấp tối đa 50).
- **Vàng:** mở rương nhân vật ngẫu nhiên, mua thẳng nhân vật, nâng cấp nhân vật (tối đa cấp 10), mua Buff May Mắn cho lượt kế, hồi sinh.
- Chỉ số cộng thêm chỉ áp dụng cho Chiến dịch và Raid. Đấu trường luôn cân bằng.
- **Nhiệm vụ:** tab 🏆 liệt kê các mốc (thắng Đấu trường, leo Raid, lên cấp, qua màn, hạ quái, sưu tầm nhân vật, gom sao) kèm thưởng vàng.
- **Nhân vật Bí ẩn** (mạnh hơn dàn thường, kể cả trong Đấu trường):
  | Nhân vật | Cách nhận |
  | --- | --- |
  | Astra, Omen | Chỉ rơi từ rương: 0,5% ở Rương Anh Hùng, 2% ở Rương Huyền Thoại. Khi đã có đủ 44 nhân vật thường, mỗi rương có 3% / 10% trúng, trượt được hoàn 60% vàng |
  | Kaiser | Thắng 100 trận Đấu trường |
  | Drakon | Thắng trọn Raid: hạ đủ 5 boss trong một lượt |
  | Eon | Đạt cấp 50 |
  | Nyx | Qua hết 50 màn Chiến dịch |
- **Rovan** là kiếm khách kiểu đấu sĩ MOBA: nhát chém thứ 3 mạnh hơn, trúng 8 đòn thì hồi máu; Q hất tung, E lướt chém tích 2 lần, R biến mất rồi giáng xuống mục tiêu.

## Cấu trúc mã nguồn

| File | Vai trò |
| --- | --- |
| `index.html`, `style.css` | Khung trang và giao diện |
| `js/data.js` | Nhân vật, quái, boss, bản đồ, buff, độ hiếm, 50 màn chiến dịch, bảng ngoại hình `LOOK` (vũ khí, trang phục, tóc của từng con) |
| `js/game.js` | Engine: chiến đấu, khiên, phòng / tầng, HUD, điều khiển |
| `js/art.js` | Toàn bộ hình vẽ trong trận: nhân vật, vũ khí, trang bị, quái, boss, địa hình theo chủ đề, hiệu ứng |
| `js/net.js` | Online PvP (WebRTC, MQTT, WebSocket) |
| `js/meta.js` | Tài khoản, lưu tiến trình, cấp độ, cửa hàng, nhiệm vụ, các màn hình, âm thanh, song ngữ Việt / Anh |
| `js/config.js` | Cấu hình công khai (mã băm mật khẩu admin chế độ thiết bị) |
| `api/` | API tài khoản trên Vercel: `auth` (đăng ký / đăng nhập), `save` (tiến trình), `admin` |
| `dev-server.js`, `tools/` | Chạy thử trên máy, đổi mật khẩu admin (không deploy) |

Muốn chỉnh độ khó hay kinh tế: `stagePlan()` trong `js/data.js` (số quái, hệ số máu / sát thương theo màn) và nhóm hằng số ở phần "progression rules" trong `js/meta.js` (XP mỗi cấp, giá rương, tỉ lệ rương, danh sách nhiệm vụ `QUESTS`, thưởng).

Muốn đổi ngoại hình một nhân vật: sửa dòng của nó trong bảng `LOOK` (`js/data.js`), ví dụ `Kaen:['sword','armor','spiky',{fl:1}]` là kiếm + giáp + tóc dựng + lưỡi kiếm bốc lửa. Các kiểu vũ khí có sẵn nằm trong `WPN` ở `js/art.js`.

Mỗi lần sửa file `js/` hoặc `style.css`, tăng số `?v=` trong `index.html` để trình duyệt của người chơi tải bản mới.
