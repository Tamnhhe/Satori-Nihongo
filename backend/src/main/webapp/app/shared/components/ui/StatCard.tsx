import React from 'react';
import { Card, CardContent, Typography, Avatar, Stack, Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export type StatCardColor = 'primary' | 'secondary' | 'success' | 'warning' | 'info';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: StatCardColor;
  diffLabel?: string; // e.g. "+12% so với tháng trước"
  footer?: React.ReactNode; // optional custom footer content (e.g. caption, chips)
  loading?: boolean;
}

/**
 * Reusable KPI card aligned with satoriTheme component tokens.
 * Use it across dashboards and pages for consistent metric presentation.
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = 'primary', diffLabel, footer, loading = false }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 2, border: theme => `1px solid ${theme.palette.divider}` }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, minHeight: 96 }}>
        <Avatar
          sx={{
            bgcolor: theme => theme.palette[color].light,
            color: theme => theme.palette[color].dark,
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" noWrap>
            {title}
          </Typography>

          <Typography variant="h4" sx={{ lineHeight: 1.25 }}>
            {loading ? '—' : value}
          </Typography>

          {diffLabel ? (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="caption" color="success.main">
                {diffLabel}
              </Typography>
            </Stack>
          ) : null}

          {footer ? <Box sx={{ mt: 0.5 }}>{footer}</Box> : null}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
