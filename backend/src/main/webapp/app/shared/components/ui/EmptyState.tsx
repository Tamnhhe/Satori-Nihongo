import React from 'react';
import { Box, Typography, Stack, Button, Avatar } from '@mui/material';

export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actionLabel?: React.ReactNode;
  onAction?: () => void;
  actionProps?: React.ComponentProps<typeof Button>;
  children?: React.ReactNode; // for custom actions or extra content
}

/**
 * EmptyState - Reusable empty state component for list/table pages and dashboards.
 * Provides a friendly message, optional icon, and a primary action.
 */
const EmptyState: React.FC<EmptyStateProps> = ({ title, description, icon, actionLabel, onAction, actionProps, children }) => {
  return (
    <Box
      sx={{
        border: theme => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={2} alignItems="center" justifyContent="center">
        {icon ? (
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.light',
              color: 'primary.dark',
            }}
          >
            {icon}
          </Avatar>
        ) : null}

        <Box>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          ) : null}
        </Box>

        {children}

        {actionLabel && onAction ? (
          <Button variant="contained" color="primary" onClick={onAction} {...actionProps}>
            {actionLabel}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
};

export default EmptyState;
