import { CommentItemProps } from "@/types/comment_item";
import { CustomerOrderItem } from "@/types/customer_order_item";
import { v4 as uuidv4 } from "uuid";


export const sampleParagraph = `Quy trình nhận hàng
Đây là gói gia hạn Zoom Pro chính chủ có thời hạn sử dụng 28 ngày.
Sau khi mua hàng, Shop sẽ đăng nhập và nâng cấp Zoom Pro cho bạn.
Bạn cần cung cấp Email và Mật khẩu tài khoản Zoom khi thanh toán đơn hàng.
Thời gian xử lý: 30 phút - 1 giờ làm việc (8h30-23h).
Hình thức nhận hàng: Shop sẽ đăng nhập và nâng cấp Zoom Pro cho bạn.
Hướng dẫn đăng nhập Zoom
Nâng cấp trải nghiệm họp trực tuyến với Zoom Pro
Sở hữu Zoom Pro ~1 tháng (28 ngày) để nâng cấp trải nghiệm họp trực tuyến với các tính năng chuyên nghiệp: không giới hạn thời gian cuộc họp, ghi lại nội dung trên đám mây, và quản lý linh hoạt. Đây là lựa chọn hoàn hảo cho doanh nghiệp, giáo dục, và làm việc từ xa. Kích hoạt nhanh chóng, sử dụng dễ dàng – giải pháp hiệu quả để kết nối và cộng tác mọi lúc, mọi nơi.

Ưu điểm của Zoom
Chất lượng cuộc gọi ổn định, chia sẻ màn hình với độ nét cao
Chất lượng âm thanh của Zoom đang được đánh giá rất tốt và ổn định, cho cuộc họp được diễn ra xuyên suốt, không bị đứt quãng. Ngoài ra, việc chia sẻ màn hình với độ nét cao cũng là một điểm vô cùng lợi thế của Zoom, giúp cho việc xem chi tiết thông tin chia sẻ không gặp khó khăn hay trở ngại.

Hỗ trợ đa nền tảng, thiết bị
Zoom được phát triển đa nền tảng như Windows, Mac, iOS, Android và thiết bị từ máy tính đến điện thoại di động. Điều này giúp cho việc sử dụng Zoom trở nên dễ dàng hơn bao giờ hết.

Phần mềm Zoom Cloud Meetings có thể kết bạn và mời bạn bè sử dụng thông qua Email
Với nhiều doanh nghiệp đang hoạt động ngoài thị trường thì việc sử dụng Zoom để hỗ trợ cho việc họp online sẽ mang đến sự tương tác một cách mới mẻ và chủ động trong công việc hơn. Các cuộc họp có thể được lưu cục bộ hoặc vào đám mây, dễ dàng tìm kiếm những lời thoại được thu âm trong quá trình họp. Ngoài ra, khả năng cho phép người tham gia chia sẻ màn hình của họ và trao đổi và kèm thêm bản ghi chú của mỗi bên khi có yêu cầu.

Ưu điểm của Zoom Pro so với bản miễn phí
- Kéo dài thời hạn cuộc họp lên đến 30h

- Chức năng quản lý người dùng: Thêm, xóa, gán vai trò...

- Kiểm soát tính năng quản trị viên: Thêm các điều khiển cuộc họp nâng cao

- Báo cáo: Số lượng cuộc họp, thời gian, số người tham gia...

- Chỉ định lịch trình: Cho phép chỉ định người khác thiết lập cuộc họp cho bạn. Người được ủy quyền cũng phải đăng ký Pro

- 5 GB lưu trữ trên Zoom Clould

Nâng cấp chính chủ Zoom Pro thời hạn 28 ngày
Gia hạn trực tiếp trên tài khoản của bạn, đảm bảo tính bảo mật và quyền sử dụng chính chủ với thời hạn sử dụng 28 ngày.
`

export const sampleComments:CommentItemProps[] = [
  {
    id: uuidv4(),
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    username: "Nguyễn Văn A",
    content: "Bài viết rất hay!",
    timestamp: "2 giờ trước",
    isOwner: true,
    replies: [],
  },
  {
    id: uuidv4(),
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    username: "Trần Thị B",
    content: "Cảm ơn bạn!",
    timestamp: "1 giờ trước",
    isOwner: false,
    replies: [],
  },
]

export const sampleCategoryList = [
  {
    id: uuidv4(),
    name: "Đồ điện tử",
    imageUrl: "https://example.com/image1.jpg",
  },
  {
    id: uuidv4(),
    name: "Thời trang",
    imageUrl: "https://example.com/image2.jpg",
  },
  {
    id: uuidv4(),
    name: "Sức khỏe",
    imageUrl: "https://example.com/image3.jpg",
  },
]

export const sampleOrderItems:CustomerOrderItem[] = [
  {
    time: new Date().toLocaleDateString(),
    order_id: uuidv4(),
    product: "Gói gia hạn Zoom Pro",
    quantity: 1,
    total: 299000,
    status: "ORDER_STATUS.COMPLETED",
    
  },
  {
    time: new Date().toLocaleDateString(),
    order_id: uuidv4(),
    product: "Gói gia hạn Zoom Pro 2",
    quantity: 1,
    total: 299000,
    status: "ORDER_STATUS.PENDING",
  },
  {
    time: new Date().toLocaleDateString(),
    order_id: uuidv4(),
    product: "Gói gia hạn Zoom Pro 2",
    quantity: 1,
    total: 299000,
    status: "ORDER_STATUS.PROCESSING",
  },
  {
    time: new Date().toLocaleDateString(),
    order_id: uuidv4(),
    product: "Gói gia hạn Zoom Pro 2",
    quantity: 1,
    total: 299000,
    status: "ORDER_STATUS.REFUNDED",
  },
]