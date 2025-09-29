//navbar template
'use client'
import React from "react"

//type for the navbarprops
type NavbarProps = {
    links: {label: string; href: string}[];
};

// Navbar definitions: accept props
// Map links and use link.href and link.label
// styles are optional 
export function Navbar({ links = [] }: NavbarProps) { 
    
    return (
    <div className="flex justify-center p-8">
    <nav className="flex items-center justify-between text-center px-4 py-2 bg-(--color-primary) text-(--color-text-secondary) rounded-xl">  
      <ul className="flex space-x-4">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
    </div>
    );
}

// define Navbar Props, here toy cand add or quit links
export default function NavLinks (){

return (
    <div>
    <Navbar
        links={[
            { label: "Home", href: "/"},
            { label: "example", href: "/example"},
            { label: "example2", href: "/example2"},
        ]}
    />
</div>
);
}

//to use this default use <Navlinks /> with the import where as you need.
