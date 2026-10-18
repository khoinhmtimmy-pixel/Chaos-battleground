# ⚔️ Chaos Battleground

Game hành động nhìn từ trên xuống chạy hoàn toàn trên trình duyệt: chiến dịch 50 màn, raid vô tận, đấu trường PvP (bot / 2v2 / online), **144 nhân vật** để mở khoá và 6 nhân vật Bí ẩn.

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

## Sự kiện Halloween (có thời hạn)

Toàn bộ nội dung theo mùa nằm sau cổng thời gian `EV` trong `js/data.js` (`s` / `e`, mặc định 20/10 – 02/11). Hết hạn thì các nút biến mất và chế độ tự ngủ — **nhưng không xoá gì cả**: kẹo đã kiếm, dấu ấn, nhân vật đã sở hữu và bóng tối đã bật vẫn giữ nguyên, không ai bị mất tiến trình giữa chừng.

- **Bóng tối**: bật trong ⚙️ Cài đặt (mặc định **tắt**), chỉ có tác dụng ở Màn chơi và Raid. Nhân vật luôn có một bong bóng sáng nhỏ quanh mình cộng hình nón đèn pin theo hướng ngắm; đèn lồng tĩnh rải khắp bản đồ. Quái trong bóng tối **vẫn gây sát thương** — đó là chủ ý, nhưng mọi thứ đứng sát bạn đều nằm trong bong bóng sáng nên không có ẩn cấp bất công. Vẽ bằng một canvas phụ, khoét lỗ bằng `destination-out`.
- **Rương Trick-or-Treat**: 2.000 vàng ở Cửa hàng, ra 300–800 🍬 kẹo và 5% cơ hội rơi nhân vật Halloween. Rương dừng bán khi đã sở hữu đủ cả ba, và không mở được nếu cửa sổ đã đóng.
- **Kẹo**: 250 🍬 đổi một Buff May Mắn ngẫu nhiên cho lượt sau, dùng lại đúng cơ chế buff có sẵn.
- **Ba nhân vật giới hạn** — Marrow, Sallow, Nettle — độ hiến 4 (Bí ẩn), đánh dấu `sec:'halloween'` nên **không** rơi từ rương thường cũng không lấy được từ nhiệm vụ; chỉ rơi từ rương Trick-or-Treat. Là nhân vật nguyên tác, không phải bản cosplay nhân vật có thật. Cả ba đều có dấu ấn riêng như mọi nhân vật khác.

Muốn đổi sang năm sau chỉ cần sửa `EV.s` và `EV.e`.

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
- **Combo (chuỗi liên chiêu):** đổi chiêu liên tiếp trong cửa sổ **2,8 giây** sẽ xếp chồng. Giữ nguyên một chiêu thì **không** lên combo — phải là Q→E→R→Q mới tính. Mỗi tầng cộng **6% sát thương**, tối đa **5 tầng (×1,24)**; hết 2,8 giây không đổi chiêu là về 0. Vì hai bên đều có nên cân bằng ở mức vừa phải. Hằng số ở `js/game.js`: `CBW` (cửa sổ), `CMX` (giới hạn tầng — **không** đặt tên `CMAX`, biến đó của `meta.js` đã dùng cho cấp nhân vật), `CBON` (sát thương mỗi tầng); hàm `bumpCombo()` gọi trong `tryCast`, hồi timer trong `tick`, nhân hệ số trong `hurt`. Đây là combo *kỹ năng*, tách khỏi `pas.x3` (đòn thứ 3 hơn mạnh) đã có sẵn ở vài nhân vật.
- **Chiêu thứ 5 — tuyệt chiêu (phím C):** mọi nhân vật có 5 chiêu `A · Q · E · R · C`. Chiêu `C` **mạnh hơn hẳn `R`** nhưng bị khoá gần như toàn bộ thời gian: chỉ dùng được khi **máu ≤ 50%** hoặc **chuỗi combo đủ 5 tầng**, và hồi **22 giây**. Nhờ vậy nó nâng trần sức mạnh mà không nâng tần suất, nên không phải giảm chỉ số gốc của nhân vật nào. Bấm khi chưa đủ điều kiện sẽ hiện `✖` chứ không bắn. Dùng xong nó **xoá chuỗi combo** — nó là khoản thưởng, không phải mắt xích. Ở PvP 2 người, người chơi thứ hai bấm `;`. Hằng số `DCD` / `DHP`, hàm `desOpen()` / `desReady()` trong `js/game.js`; `balScale` trong `js/data.js` cũng cân luôn `c` cùng các ô khác; validator `tools/gen-roster.js` **bắt buộc** mọi nhân vật phải có `c` với `cd:22`.
- **Chiều sâu giả (2.5D, không cần WebGL):** toàn bộ đồ hoạ vẫn là Canvas 2D vẽ bằng code, nhưng mọi vật thể đứng trên một nguồn sáng chung — `LIGHT` trong `js/art.js` — và đổ bóng theo hướng đó. Bóng được vẽ bằng một sprite gradient dựng sẵn (`softShadow`) thay cho ellipse cứng, nên nhân vật, cây đá, bụi cây, vật phẩm, rương và cổng đều *tiếp xúc* mặt đất thay vì trông như miếng dán. `castSh()` dịch bóng theo hướng sáng để nhân vật có cảm giác đứng trên sàn. Không có bước nào đụng tới cơ chế trúng đòn, nên độ khó không đổi.
- **Showcase nhân vật ở tab Nhân vật:** thẻ thông tin dùng một canvas `showcase` thay cho ảnh tĩnh — đĩa xoay có vạch và hạt sáng chạy theo góc xoay, ánh sáng viền (silhouette lệch về phía nguồn sáng, vẽ bằng `lighter` dưới nhân vật), vệt specular quét ngang thân, phản chiếu trên sàn và bụi lơ lửng. Tự xoay, **kéo được để xoay tay**, và tự dừng khi rời trang hoặc tab bị ẩn. `showcaseFrame()` trong `js/art.js`, vòng lặp `showcaseStart()` trong `js/meta.js`. Nhân vật **vẫn là đồ hoạ 2D** — chiều sâu là giả, vì dựng lại 171 nhân vật thành mesh 3D là đánh đổi luôn cam kết không-file-đồ-hoạ của dự án.
- **Kiểm tra tên toàn cục:** mọi thẻ `<script>` trong `index.html` dùng chung một global scope, nên khai báo trùng tên ở cấp cao nhất là **SyntaxError và làm hỏng toàn bộ game** — đã xảy ra hai lần (`CMAX` giữa `game.js` và `meta.js`, `cast` giữa `art.js` và `game.js`). Chạy `node tools/check-globals.js` để chặn trước khi nó xảy ra lần thứ ba; nó đọc danh sách script thật từ `index.html` nên không lệch với trình duyệt.
- **Chiến dịch:** 5 chương × 10 màn, màn 5 có quái tinh anh, màn 10 có boss. Qua phòng được chọn 1 trong 3 buff. Gục ngã được hồi sinh 1 lần bằng vàng.
- **Raid vô tận:** mở sau màn 1-3; mỗi tầng 5 phòng (phòng 3 kho báu, phòng 5 boss), càng lên càng khó.
- **Lên cấp:** qua màn / raid nhận XP. Mỗi cấp cho 1 điểm để cộng Máu, Khiên, Sát thương, Tốc độ (tối đa 25 mỗi loại, cấp tối đa 100). Đường XP giữ nguyên `50+30l+4l²` cho cấp 1–50 rồi chuyển sang đường phẳng hơn cho 51–100, nên tổng XP lên 100 là khoảng 3,2 lần lên 50. Vì 4×25 = 100 điểm chứa đủ 99 điểm của cấp 100, không có cấp nào mà không dùng được điểm; hệ số `BON` giảm tương ứng nên công suất tối đa của mỗi chỉ số không đổi.
- **Vàng:** mở rương nhân vật ngẫu nhiên, mua thẳng nhân vật, nâng cấp nhân vật (tối đa cấp 10), mua phụ kiện, mua Buff May Mắn cho lượt kế, hồi sinh.
- **Phụ kiện:** 31 món dùng chung ở 3 chỗ (Đầu · Vùi người · Hào quang) + **1 Dấu ấn riêng cho từng nhân vật** (sinh tự động từ `CH` trong `js/data.js`, nên thêm nhân vật mới là có dấu ấn). Dấu ấn nằm ở chỗ Vùi người, miễn phí, và **chỉ mặc được khi đang chọn đúng nhân vật đó** — client lọc ở `fixGear`/`gearDo`, server kiểm lại ở `clean()` để không tin client. Cộng thêm máu / khiên / sát thương / tốc độ, hút máu hoặc rút ngắn hồi chiêu — cùng trục với điểm nâng cấp nhưng là trục riêng. Bộ huyền thoại tối đa được ×1.18 máu / ×1.18 sát thương, cố ý thấp hơn một trục chỉ số max (×1.80). Giống điểm cộng, **chỉ áp dụng cho Chiến dịch và Raid**.
  - Trang 💍 Trang bị chia làm: thẻ **Đang mặc** (3 chỗ đang đeo + tổng cộng), một thẻ cho mỗi chỗ chỉ chứa đồ dùng chung, và một thẻ riêng cho **dấu ấn của nhân vật đang chọn**. Trước đó 154 dấu ấn nằm chung lưới "Vùi người" thành 164 ô trong đó 153 ô khoá không dùng được; giờ cả trang chỉ còn 32 ô.
- **Toàn vẹn save (quan trọng):** `clean()` trong `api/_lib.js` cắt bớt `own` / `gw` / `q` / `stars` khi lưu lên server. Các trần đó **phải luôn lớn hơn số lượng thật**, nếu không mỗi lần ghi/đọc save sẽ âm thầm xoá tiến trình. Chúng từng đặt là 80 nhân vật / 64 phụ kiện — đúng lúc roster còn nhỏ — rồi âm thầm xoá **74 nhân vật và 121 phụ kiện** của người chơi sở hữu tất cả. Nay là `MAXOWN=256`, `MAXGW=320`, `MAXQ=64`, `MAXSTAR=60`, và `tools/gen-roster.js --check` **tự động fail** nếu nội dung vượt trần. Phía client, `loadSave()` không còn ghi đè bản local bằng một payload mỏng hơn, và luôn giữ một bản sao ở khoá `..._bak`.
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
- **Aya** mang bất tưởng: đạn bay của đối phương tới gần sẽ chậm dần rồi dừng hẳn trước mặt cô, và R mở Hội Nhất Kế quét sạch một vùng. Bất tưởng là `pas.inf` trong `js/data.js` (bán kính tính bằng pixel); engine xử lý ở vòng cập nhật đạn trong `js/game.js`.
- **Ren** và **Vaen** là hai kiểu giao chiến hoàn toàn khác: Ren hồi máu và nhanh hơn (Q kéo nhanh dài hơn), R biến thành Titan trong 9 giây — ×1.7 sát thương, +90% máu, +50% khiên, nhanh hơn, rồi trả lại đúng chỉ số gốc khi hết. Vaen có đòn đánh nhanh nhất trong game, bám neo bằng khí và R tạo vòng lưởng kiếm quanh người.

## Cấu trúc mã nguồn

| File | Vai trò |
| --- | --- |
| `index.html`, `style.css` | Khung trang và giao diện |
| `js/data.js` | Nhân vật, quái, boss, bản đồ, buff, độ hiếm, 50 màn chiến dịch, bảng ngoại hình `LOOK` (vũ khí, trang phục, tóc của từng con) |
| `js/roster.js` | **File sinh tự động** bởi `tools/gen-roster.js`: 100 nhân vật + ngoại hình + cấp hiếm (`RARE_R`, `LEGEND_R`). `data.js` gộp vào `CH` / `LOOK` trước bước hậu xử lý |
| `js/game.js` | Engine: chiến đấu, khiên, phòng / tầng, HUD, điều khiển |
| `js/art.js` | Toàn bộ hình vẽ trong trận: nhân vật, vũ khí, trang bị, quái, boss, địa hình theo chủ đề, hiệu ứng |
| `js/net.js` | Online PvP (WebRTC, MQTT, WebSocket) |
| `js/meta.js` | Tài khoản, lưu tiến trình, cấp độ, cửa hàng, nhiệm vụ, các màn hình, âm thanh, song ngữ Việt / Anh |
| `js/config.js` | Cấu hình công khai (mã băm mật khẩu admin chế độ thiết bị) |
| `api/` | API tài khoản trên Vercel: `auth` (đăng ký / đăng nhập), `save` (tiến trình), `admin` |
| `dev-server.js`, `tools/` | Chạy thử trên máy, đổi mật khẩu admin, kiểm tra phụ kiện, sinh lại roster (không deploy) |

Muốn chỉnh độ khó hay kinh tế: `stagePlan()` trong `js/data.js` (số quái, hệ số máu / sát thương theo màn) và nhóm hằng số ở phần "progression rules" trong `js/meta.js` (XP mỗi cấp, giá rương, tỉ lệ rương, danh sách nhiệm vụ `QUESTS`, thưởng).

### Kiểu AI của quái (`js/ai.js`)

Mọi quái PvE chạy **một máy trạng thái chung**; khác nhau chỉ ở bảng số `FOE_AI`. Hai kiểu hành vi đang có:

| Kiểu | Cách chơi của người chơi | Quái đang dùng |
| --- | --- | --- |
| `chaser` | Cận chiến, ép sát và chém; phải lùi / né để không bị dồn | Goblin, Ogre, Bat, Slime, Skeleton Knight |
| `ranged` | Giữ khoảng, bắn tỉa; phải áp sát hoặc dùng địa hình | Imp Archer, Wraith, Bomb Imp, Hex Mage, Fire Imp, Frost Shaman, Necromancer |

Trạng thái mỗi khung hình: `chase` (ép sát) → `strike`/`hold` (trong tầm, đánh/ghìm) → `retreat` (quá gần thì lùi) → `reposition` (bị tường chặn thì né ngang rồi đi tiếp). Vài điểm được giữ cố định:

- **Không xoay tức thời:** quái quay mặt có tốc độ giới hạn (`turn`, rad/giây) cộng một độ lệch ngắm chậm (`jit`), nên không bao giờ bám dính tuyệt đối.
- **Đòn có thể phản ứng:** quái `ranged` phải ngắm ổn định `tele` giây trước khi bắn; quái mới vào trận chờ `react` giây.
- **Không kẹt vô hạn:** nếu đang cố đi mà không nhích, nó chuyển sang `reposition`, và sau vài lần vẫn kẹt thì tự tìm về giữa sân.
- **Rẻ khi đông:** mỗi con chỉ quét lại mục tiêu mỗi `AI_SEEK` giây (0,25s) thay vì mỗi khung hình.
- **Dừng khi trận kết thúc:** `raid.state != 'fight'` hoặc `over > 0` (bảng "round mới" ở Đấu trường) thì mọi AI đứng yên, không đánh người đã gục.

### Boss Obsidian Warden (`js/boss.js`)

Một boss mới trong danh sách raid boss, chạy trên chính engine hiện có (move/tryCast/FX/say/spawnFoes), không có engine riêng:

- **Giới thiệu & thanh máu:** spawnRoom đã có `say` + `sfx('boss')` và thanh máu boss trong HUD; thêm `bossAI:'warden'` để bật logic riêng.
- **Mẫu tấn công:** Slam (telegraph nova), Charge (dash), Sweep (beam), Abyssal Quake (radial); mỗi đòn có vòng cảnh báo (`FX('ring',...)`) trước khi nổ.
- **Hai pha** (theo HP): >60% pha 1; ≤60% pha 2 (triệu hồi 2 quái, nhanh hơn); ≤25% pha 3 (giận dữ ×1.3 sát thương + haste, triệu hồi 3 quái). Chuyển pha chỉ kích hoạt một lần (`bossPhase`).
- **Cửa sổ phản công:** máy trạng thái `idle → telegraph → recover → idle`; trong `recover` boss chỉ né ngang và không đánh, người chơi có thời gian đánh trả.
- **Không chồng mẫu:** chỉ một đòn tại một thời điểm; `bossT` làm cooldown.
- **Kết thúc / phần thưởng / dọn dẹp:** dùng đường `slay()`/`credit()`/`dropLoot()`/`delete others[id]` sẵn có; quái triệu hồi còn lại phải bị hạ trước khi phòng sạch.

Chạy `node tools/test-boss.js` để kiểm tra chuyển pha, điều kiện hạ gục, phần thưởng và dọn dẹp mà không cần mở trình duyệt.

Thêm kiểu mới (ví dụ **Tank** hay **Flanker**): thêm một dòng vào `FOE_AI` (chỉ số) rồi gán `ai:'tank'` cho quái trong `js/data.js`. Nếu hành vi chỉ khác về số (Tank = chaser chậm, trâu) thì không cần sửa máy trạng thái; Flanker cần thêm một nhánh trong phần chọn trạng thái của `foeAI()` (điểm tiếp cận lệch 90° quanh mục tiêu). Tinh chỉnh riêng một con: `aiP:{...}` trên bản ghi quái đó sẽ đè lên dòng chung. Chạy `node tools/test-ai.js` để kiểm tra AI mà không cần mở trình duyệt.

### Daily Challenge & bảng xếp hạng cục bộ (`js/daily.js`)

Thuần client-side (game đã có sẵn tài khoản cloud/device nhưng tính năng này không đụng tới backend):

- **Thử thách theo ngày, tất định:** `getUtcDateKey()` chốt ngày theo **UTC** (mọi múi giờ cùng một thử thách trong ngày), seed vào PRNG Mulberry32 → deterministic: cùng ngày ra cùng anh hùng / bản đồ nhỏ / modifier / tiêu đề, kể cả sau khi tải lại trang hay mở phiên mới.
- **Bắt đầu lượt:** nút `data-a="dailyRun"` trên trang chủ → `startDailyRun()` mở một lượt **Raid vô tận** với hero + map + modifier của ngày (chỉ số được áp dụng trong `newRun(cfg)`: `spMul/dmMul/hpMul/cdMul/lsAdd/enemyDmMul/goldMul`). Các trận thường không bị ảnh hưởng — multiplier mặc định là 1.
- **Ghi điểm:** `endRun()` chỉ gọi `dailyFinishRun()` khi `raid.daily` được bật; `dailyFinishRun` có cờ chống ghi đôi. Điểm = kills×10 + floor×50 + room-clear + 200 nếu thắng.
- **Bảng cục bộ:** `cb_daily_scores` trong localStorage, tối đa 50 lượt, sắp theo điểm → thời gian → hạ gục. Dữ liệu hỏng / thiếu / sai kiểu được lọc hoặc reset về rỗng thay vì làm hỏng game.
- **UI tách khỏi luật:** toàn bộ luật nằm trong `js/daily.js`, card + nút trên trang chủ (`chalCard()`), chữ dịch qua `t('dch*')`. Card ghi rõ: điểm chỉ lưu trên máy, **không phải xếp hạng toàn cầu và không chống gian lận**.

Chạy `node tools/test-daily.js` để kiểm tra tính tất định theo ngày, ghi điểm, sắp hạng, dữ liệu hỏng và glue contract mà không cần mở trình duyệt.

Muốn có bảng xếp hạng thật trong tương lai: thêm endpoint `/api/leaderboard` (Upstash Redis qua `api/_lib.js`), chấm điểm **trên server** từ replay hoặc checksum lượt chơi, ghi theo `dateKey` UTC, giới hạn mỗi tài khoản N lượt/ngày, và chỉ hiển thị tên nhân vật đã public. Không nên tin điểm do client gửi lên.


Muốn thêm hoặc chỉnh phụ kiện: bảng `GEAR` trong `js/data.js` (`id` khớp regex `GEARID` ở `api/_lib.js`, `art` là khoá vẽ trong `js/art.js`, `b` là phần thưởng). Chạy `node tools/check-gear.js` để kiểm tra id trùng, slot thiếu món, khoá vẽ chưa dùng, và bộ huyền thoại có vượt trục chỉ số hay không.

Muốn sửa 100 nhân vật sinh tự động: sửa bảng `ROSTER` trong `tools/gen-roster.js` rồi chạy `node tools/gen-roster.js` để sinh lại `js/roster.js` (**đừng sửa `js/roster.js` tay, nó sẽ bị ghi đè**). Script tự kiểm tra trước khi ghi: tên phải 2–12 chữ cái (khớp regex `HERO` ở `api/_lib.js`), không trùng nhân vật sẵn có, vũ khí / trang phục / tóc / mũ phải nằm trong từ vựng mà `js/art.js` vẽ được, và mỗi nhân vật phải có đủ 4 chiêu hợp lệ. Thêm nhân vật thì nhớ đưa vào một `K` archetype sẵn có hoặc viết thêm archetype mới.

Muốn đổi ngoại hình một nhân vật: sửa dòng của nó trong bảng `LOOK` (`js/data.js`), ví dụ `Kaen:['sword','armor','spiky',{fl:1}]` là kiếm + giáp + tóc dựng + lưỡi kiếm bốc lửa. Các kiểu vũ khí có sẵn nằm trong `WPN` ở `js/art.js`.

Mỗi lần sửa file `js/` hoặc `style.css`, tăng số `?v=` trong `index.html` để trình duyệt của người chơi tải bản mới.
