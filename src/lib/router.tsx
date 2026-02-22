import { useState, useEffect, createContext, useContext, useCallback } from "react";

interface RouterContext {
  path: string;
  navigate: (to: string) => void;
}

const RouterCtx = createContext<RouterContext>({
  path: "/",
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterCtx);
}

export function Router({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash || "/";
  });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      setPath(hash || "/");
    };
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) {
      window.location.hash = "#/";
    }
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = `#${to}`;
  }, []);

  return (
    <RouterCtx.Provider value={{ path, navigate }}>
      {children}
    </RouterCtx.Provider>
  );
}

interface RouteProps {
  path: string;
  component: React.ComponentType;
}

export function Routes({ routes }: { routes: RouteProps[] }) {
  const { path } = useRouter();

  for (const route of routes) {
    if (route.path === path) {
      const Component = route.component;
      return <Component />;
    }
  }

  const fallback = routes.find((r) => r.path === "/");
  if (fallback) {
    const Component = fallback.component;
    return <Component />;
  }

  return null;
}

export function Link({
  to,
  children,
  className,
  onClick,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(to);
    onClick?.();
  };

  return (
    <a href={`#${to}`} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
