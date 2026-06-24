// Renders the correct navigation bar based on the current user's role

(function () {
  function currentPage() {
    return window.location.pathname.split('/').pop() || 'index.html';
  }

  function isActive(page) {
    return currentPage() === page ? ' class="active"' : '';
  }

  function buildNav() {
    const role = vcGetRole();
    const session = vcGetSession();
    const page = currentPage();

    /* shared pieces */
    const home     = `<a href="index.html"${isActive('index.html')} data-i18n="nav.home">Home</a>`;
    const about    = `<a href="about.html"${isActive('about.html')} data-i18n="nav.about">About</a>`;
    const contact  = `<a href="contact.html"${isActive('contact.html')} data-i18n="nav.contact">Contact</a>`;
    const shops    = `<a href="shops.html"${isActive('shops.html')} data-i18n="nav.shops">My Shop</a>`;
    const products = `<a href="products.html"${isActive('products.html')} data-i18n="nav.products">Products</a>`;
    const wishlist = `<a href="wishlist.html"${isActive('wishlist.html')} data-i18n="nav.wishlist">Wishlist</a>`;
    const toggle   = `<button id="lang-toggle" onclick="toggleLang()" title="Switch language">ಕನ್ನಡ</button>`;

    /* user dropdown */
    function userDropdown(name, extraLinks) {
      extraLinks = extraLinks || '';
      return `
        <div class="nav-user-menu" id="nav-user-menu">
          <button class="nav-user-btn" onclick="toggleUserMenu()" id="nav-user-btn">
            <span class="nav-avatar">${name.charAt(0).toUpperCase()}</span>
            <span class="nav-uname">${name}</span>
            <span class="nav-chevron">&#9662;</span>
          </button>
          <div class="nav-dropdown" id="nav-dropdown">
            ${extraLinks}
            <a href="#" onclick="vcLogout(); return false;" class="nav-dd-item nav-dd-logout">&#128682; Logout</a>
          </div>
        </div>`;
    }

    let inner = '';

    if (!role) {
      /* GUEST — Home, About, Contact, User Login, Vendor Login, Admin, toggle */
      inner = `
        ${home}
        ${about}
        ${contact}
        <a href="user-login.html"${isActive('user-login.html')} class="nav-vendor" data-i18n="nav.user_login">User Login</a>
        <a href="vendor-login.html"${isActive('vendor-login.html')} class="nav-vendor" data-i18n="nav.vendor_login">Vendor Login</a>
        <a href="admin-login.html"${isActive('admin-login.html')} class="nav-admin" data-i18n="nav.admin">Admin</a>
        ${toggle}`;
    } else if (role === 'user') {
      /* USER — Home, About, Contact, Shops, Products, Wishlist, dropdown, toggle */
      inner = `
        ${home}
        ${about}
        ${contact}
        ${shops}
        ${products}
        ${wishlist}
        ${userDropdown(session.name,
          `<a href="wishlist.html" class="nav-dd-item">&#10084;&#65039; My Wishlist</a>`
        )}
        ${toggle}`;
    } else if (role === 'vendor') {
      /* VENDOR — Home, About, Contact, Shops, dropdown, toggle */
      inner = `
        ${home}
        ${about}
        ${contact}
        ${shops}
        ${userDropdown(session.shopname,
          `<a href="vendor-dashboard.html" class="nav-dd-item">&#127978; My Shop Dashboard</a>`
        )}
        ${toggle}`;
    } else if (role === 'admin') {
      /* ADMIN — sees everything */
      inner = `
        ${home}
        ${about}
        ${contact}
        ${shops}
        ${products}
        ${wishlist}
        <a href="vendor-login.html" class="nav-vendor" data-i18n="nav.vendor_login">Vendor Login</a>
        <a href="admin-login.html"${isActive('admin-login.html')} class="nav-admin">Admin &#10003;</a>
        ${userDropdown('Admin',
          `<a href="admin-login.html" class="nav-dd-item">&#128272; Admin Panel</a>`
        )}
        ${toggle}`;
    }

    /* inject into every header>nav found on the page */
    document.querySelectorAll('header nav').forEach(function(nav) {
      nav.innerHTML = inner;
    });

    /* patch footer links based on role and page */
    patchFooter(role, page);

    /* re-apply translations after nav is rebuilt */
    if (typeof applyLang === 'function') {
      applyLang(typeof getLang === 'function' ? getLang() : 'en');
    }

    /* update toggle button text */
    if (typeof updateToggle === 'function') {
      updateToggle(typeof getLang === 'function' ? getLang() : 'en');
    }
  }

  /* FOOTER PATCHER */
  function patchFooter(role, page) {
    var footerLinks = document.querySelector('footer .footer-links');
    if (!footerLinks) return;

    var isHome = (page === 'index.html' || page === '');

    var links = '<a href="index.html">Home</a>'
      + '<a href="about.html">About</a>'
      + '<a href="contact.html">Contact</a>';

    if (!role) {
      /* GUEST */
      links += '<a href="user-login.html">User Login</a>';
      links += '<a href="vendor-login.html">Vendor Login</a>';
      links += '<a href="vendor-register.html">Register Shop</a>';
      if (isHome) {
        links += '<a href="admin-login.html">Admin</a>';
      }
    } else if (role === 'user') {
      /* USER — shops, products, wishlist; no admin */
      links += '<a href="shops.html">Shops</a>';
      links += '<a href="products.html">Products</a>';
      links += '<a href="wishlist.html">Wishlist</a>';
    } else if (role === 'vendor') {
      /* VENDOR — shops; no admin */
      links += '<a href="shops.html">My Shop</a>';
      links += '<a href="vendor-dashboard.html">My Shop</a>';
    } else if (role === 'admin') {
      /* ADMIN — everything */
      links += '<a href="shops.html">Shops</a>';
      links += '<a href="products.html">Products</a>';
      links += '<a href="wishlist.html">Wishlist</a>';
      links += '<a href="vendor-login.html">Vendor Login</a>';
      links += '<a href="vendor-register.html">Register Shop</a>';
      links += '<a href="admin-login.html">Admin</a>';
    }

    footerLinks.innerHTML = links;
  }

  /* user menu toggle */
  window.toggleUserMenu = function () {
    var dd = document.getElementById('nav-dropdown');
    if (dd) dd.classList.toggle('open');
  };

  /* close dropdown when clicking outside */
  document.addEventListener('click', function (e) {
    var menu = document.getElementById('nav-user-menu');
    if (menu && !menu.contains(e.target)) {
      var dd = document.getElementById('nav-dropdown');
      if (dd) dd.classList.remove('open');
    }
  });

  /* run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
