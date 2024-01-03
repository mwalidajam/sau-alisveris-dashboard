import React, { useRef, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
// import logout icon
import LogoutIcon from "@mui/icons-material/Logout";
// import world icon
import MapIcon from "@mui/icons-material/Map";
import { SvgIconProps } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { usePermissions } from "@/contexts/Permissions";

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
  tabBarContents?: React.ReactNode;
  window?: () => Window;
  title?: string;
  breadcrumbs?: Array<{ title: string; href?: string }>;
}

export default function ResponsiveDrawer({
  window,
  title,
  children,
  tabBarContents,
  breadcrumbs,
}: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: {
            sm: `calc(100% - ${drawerWidth + 30}px)`,
            xs: "calc(100% - 20px)",
          },
          margin: `10px 10px 10px ${drawerWidth + 10}px`,
          ml: { sm: `${drawerWidth + 10}px` },
          borderRadius: "10px",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Breadcrumbs>
            {breadcrumbs?.map((breadcrumb, index) =>
              breadcrumb.href ? (
                <Link key={index} href={breadcrumb.href} color={"#ffffff"}>
                  <Typography color="#fff">{breadcrumb.title}</Typography>
                </Link>
              ) : (
                <Typography key={index} color="#fff">
                  {breadcrumb.title}
                </Typography>
              )
            )}
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <DrawerContent />
        </Drawer>
        <Drawer
          variant="persistent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          PaperProps={{
            elevation: 0,
            sx: {
              border: "none",
              bgcolor: "#fff",
              height: "calc(100% - 20px)",
              margin: "10px",
              borderRadius: "10px",
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            },
          }}
          open
        >
          <DrawerContent />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { sm: 3, xs: 1 },
          pt: { xs: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)`, xs: "100%" },
        }}
      >
        <Toolbar />
        <Box sx={{ height: "calc(100vh - 120px)" }}>
          <Box sx={{ mb: 2 }}>{tabBarContents}</Box>
          {children}
        </Box>
      </Box>
    </Box>
  );
}

type NavbarProps = {
  title: string;
  href: string;
  icon: React.ReactElement<SvgIconProps>;
  is_allowed: boolean;
};

const DrawerContent: React.FC = () => {
  const { roleOrPermission, role } = usePermissions();
  const logoutRef = useRef<HTMLAnchorElement>(null);
  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "POST",
    });
    signOut({
      callbackUrl: "/",
      redirect: false,
    });
  };
  const navItems: NavbarProps[] = [
    {
      title: "Anasayfa",
      href: "/",
      icon: <HomeIcon />,
      is_allowed: true,
    },
    {
      title: "Ürünler",
      href: "/products",
      icon: <BookIcon />,
      is_allowed: true,
    },
    {
      title: "Kullanıcılar",
      href: "/users",
      icon: <PeopleIcon />,
      is_allowed: role("super-admin"),
    },
  ];
  useEffect(() => {
    if (logoutRef.current) {
      logoutRef.current.addEventListener("click", handleLogout);
    }
    return () => {
      if (logoutRef.current) {
        logoutRef.current.removeEventListener("click", handleLogout);
      }
    };
  }, []);
  return (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {navItems.map(
          (item, index) =>
            item.is_allowed && (
              <ListItem key={index} disablePadding>
                <Link href={item.href} style={{ width: "100%" }} legacyBehavior>
                  <ListItemButton>
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItemButton>
                </Link>
              </ListItem>
            )
        )}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary={"Çıkış yap"} sx={{ color: "#d32f2f" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};
