"use client"
import { CartContext } from '@/context/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useContext, useState } from 'react'
import Logo from '@/components/Logo'
import { BRAND } from '@/lib/brand'

/*
  This was a <button> carrying an `href` prop (invalid, and React warns) that
  navigated via router.push. That meant no middle-click, no open-in-new-tab, no
  link semantics for assistive tech. It's a real link now, with the current page
  marked by aria-current rather than colour alone, and the cart count given a
  spoken label instead of a bare number.
*/
const CustomLink = ({href, name, items, toggle}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  // Sizes down at md so five links plus the wordmark fit on a tablet without
  // wrapping onto a second line, then back up at lg.
  const base = "relative flex items-center min-h-11 py-2 px-2 font-semibold whitespace-nowrap transition duration-300";
  const tone = isActive
    ? "text-green-400"
    : "text-gray-300 hover:text-green-400";

  return(
    <Link
      href={href}
      onClick={toggle}
      aria-current={isActive ? "page" : undefined}
      className={`${base} ${tone}`}
    >
      <span className="ml-2 text-start text-base lg:text-lg">{name}</span>
      {items > 0 && (
        <span className="absolute top-0 left-16 px-2 text-emerald-700 rounded-full bg-white">
          <span aria-hidden="true">{items}</span>
          <span className="sr-only">{`${items} item${items === 1 ? "" : "s"} in cart`}</span>
        </span>
      )}
    </Link>
  )
}

const Navbar = () => {
  const [showMobileNav, setShowMobileNav] = useState(false)
  const {cartProducts} = useContext(CartContext);
  const pathname = usePathname()
  const handleClick = () => {
    setShowMobileNav(!showMobileNav)
  }
  return (    
    <nav className="bg-black shadow-lg">
        <div className="mx-auto px-4 mr-8">
            <div className="flex justify-between">
                <div className="flex space-x-2 justify-between flex-1">
                    <div>
                        <Link href="/" className="flex items-center py-4 px-2 text-white" aria-label={`${BRAND.name} home`}>
                            <Logo />
                        </Link>
                    </div>                  
                    <div className="hidden md:flex items-center space-x-1">
                      <CustomLink href={"/#"} name={"Home"} toggle={handleClick}/>
                      <CustomLink href={"/products"} name={"All products"} toggle={handleClick}/>
                      <CustomLink href={"/categories"} name={"Categories"} toggle={handleClick}/>
                      <CustomLink href={"/account"} name={"Account"} toggle={handleClick}/>
                      <CustomLink href={"/cart"} name={"Cart"} items={cartProducts.length} toggle={handleClick}/>
                    </div>
                </div>
                <div className="md:hidden flex items-center">
                    {/* `outline-none` removed the only focus indicator, and
                        `x-show` was a leftover Alpine.js attribute React
                        doesn't understand. */}
                    <button onClick={handleClick}
                        aria-label={showMobileNav ? "Close menu" : "Open menu"}
                        aria-expanded={showMobileNav}
                        className="min-w-11 min-h-11 inline-flex items-center justify-center">
                    <svg className=" w-6 h-6 text-gray-300 hover:text-green-500 "
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                </div>
            </div>
        </div>
        {
         showMobileNav && (
            <div className="md:hidden flex flex-col">
                <CustomLink href={"/#"} name={"Home"}toggle={handleClick}/>
                <CustomLink href={"/products"} name={"All products"} toggle={handleClick}/>
                <CustomLink href={"/categories"} name={"Categories"} toggle={handleClick}/>
                <CustomLink href={"/account"} name={"Account"} toggle={handleClick}/>
                <CustomLink href={"/cart"} name={"Cart"} items={cartProducts.length} toggle={handleClick}/>
            </div> 
         )
        }
        
    </nav>
  )
}

export default Navbar