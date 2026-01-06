import styles from './page.module.css';
import { Button } from '@/components/ui/Button/Button';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Bảng Điều Khiển Bầu Cử</h1>
        <p className={styles.subtitle}>Chào mừng cổ đông đến với hệ thống biểu quyết online.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <h3>Thông tin Đại hội</h3>
          <p>Hiện tại chưa có cuộc bầu cử nào đang diễn ra.</p>
        </div>
      </div>

      <div className={styles.footer}>
        <Button variant="outline" onClick={() => {
          // Xóa token (client side)
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.reload();
        }}>
          Đăng xuất
        </Button>
      </div>
    </main>
  );
}
