import React from 'react';
import { Box, Switch, FormControlLabel, Paper, Typography, Divider } from '@mui/material';
import { useAppSelector } from 'app/config/store';

/**
 * UI Toggle Component for switching between JHipster and Custom Business UI
 * This component can be accessed via /ui-settings or embedded in user settings
 */
const UIToggle: React.FC = () => {
  const [useNewUI, setUseNewUI] = React.useState(() => {
    return localStorage.getItem('satori-use-new-ui') === 'true';
  });

  const account = useAppSelector(state => state.authentication.account);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setUseNewUI(newValue);
    localStorage.setItem('satori-use-new-ui', newValue.toString());

    // Reload page to apply changes
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Cài đặt giao diện
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Chọn phiên bản giao diện phù hợp với nhu cầu sử dụng của bạn.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <FormControlLabel
          control={<Switch checked={useNewUI} onChange={handleToggle} color="primary" />}
          label={
            <Box>
              <Typography variant="body1" fontWeight="medium">
                Sử dụng giao diện mới (Satori Business UI)
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Giao diện được thiết kế riêng cho nền tảng giáo dục tiếng Nhật
              </Typography>
            </Box>
          }
        />

        <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Giao diện hiện tại: {useNewUI ? 'Satori Business UI' : 'JHipster UI'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {useNewUI
              ? 'Bạn đang sử dụng giao diện kinh doanh tùy chỉnh với các tính năng chuyên biệt cho giáo dục.'
              : 'Bạn đang sử dụng giao diện JHipster tiêu chuẩn với các tính năng quản lý cơ bản.'}
          </Typography>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Tính năng giao diện mới:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mt: 1 }}>
            <Typography component="li" variant="body2">
              Dashboard chuyên biệt cho giáo viên và quản trị viên
            </Typography>
            <Typography component="li" variant="body2">
              Thiết kế phù hợp với văn hóa Nhật Bản
            </Typography>
            <Typography component="li" variant="body2">
              Quản lý bài học và học viên tối ưu
            </Typography>
            <Typography component="li" variant="body2">
              Báo cáo và phân tích chi tiết
            </Typography>
            <Typography component="li" variant="body2">
              Giao diện responsive cho mobile
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default UIToggle;
