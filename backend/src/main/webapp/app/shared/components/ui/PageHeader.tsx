import React from 'react';
import { Box, Stack, Typography, Breadcrumbs, Link as MuiLink, Button, SxProps, Theme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string; // if absent, render as plain text
}

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode; // right side actions (buttons)
  sx?: SxProps<Theme>;
  bottom?: React.ReactNode; // secondary toolbar area below actions (e.g., filters)
}

/**
 * PageHeader - Consistent page header with optional breadcrumbs, subtitle and action area.
 * Use on entity list/detail pages and dashboards for visual consistency.
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, breadcrumbs, actions, sx, bottom }) => {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
          {breadcrumbs.map((c, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            if (!c.to || isLast) {
              return (
                <Typography key={idx} color={isLast ? 'text.primary' : 'text.secondary'} variant="body2">
                  {c.label}
                </Typography>
              );
            }
            return (
              <MuiLink key={idx} component={RouterLink} underline="hover" color="inherit" to={c.to}>
                {c.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      ) : null}

      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" sx={{ mb: subtitle ? 0.5 : 0 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Box>

        {actions ? (
          <Stack direction="row" spacing={1}>
            {actions}
          </Stack>
        ) : null}
      </Stack>

      {bottom ? <Box sx={{ mt: 2 }}>{bottom}</Box> : null}
    </Box>
  );
};

export default PageHeader;
