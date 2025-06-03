"use client";

import React, { useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ClickAwayListener from "@mui/material/ClickAwayListener";

interface Notification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
}

const NotificationMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "طلب جديد",
      message: "تم استلام طلب جديد من المستخدم",
      isRead: false,
    },
    {
      id: 2,
      title: "تم تحديث الطلب",
      message: "تم تعيين فني للطلب رقم #542",
      isRead: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
    handleClose();
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-controls={open ? "notification-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Badge
            badgeContent={unreadCount}
            color="error"
            invisible={unreadCount === 0}
          >
            <NotificationsIcon className="text-primary fill-gray-400" />
          </Badge>
        </IconButton>

        <Menu
          id="notification-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              minWidth: "350px",
            },
          }}
        >
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <MenuItem
                key={notif.id}
                onClick={() => handleNotificationClick(notif.id)}
                selected={!notif.isRead}
              >
                <ListItemText
                  primary={
                    <Typography fontWeight="bold">{notif.title}</Typography>
                  }
                  secondary={notif.message}
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>لا توجد إشعارات</MenuItem>
          )}
        </Menu>
      </div>
    </ClickAwayListener>
  );
};

export default NotificationMenu;
