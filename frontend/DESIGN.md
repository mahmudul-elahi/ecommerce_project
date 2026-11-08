# OmniShop storefront design

OmniShop uses a familiar, easy-to-shop ecommerce layout. Keep controls predictable and let store and product photography do the visual work.

## Color

- Page background: `slate-50` (`#f8fafc`)
- Cards and navigation: white
- Main text: `slate-900`
- Supporting text: `slate-600`
- Borders: `slate-200`
- Primary actions and links: `blue-600` with `blue-700` hover
- Stock and success states: green; unavailable and destructive states: red

Use blue for actions and navigation, not for every surface. Keep text contrast strong and avoid mixing unrelated accent colors.

## Layout and components

- Use a standard header with shop browsing, account actions, and a visible cart count.
- Home page: clear welcome message, prominent shop search, simple category filters, then a grid of shops.
- Shop page: store banner and identity, then search and sorting controls, then a responsive product grid.
- Product cards show a clear image, name, availability, price, and add-to-cart action.
- Use white cards, light borders, modest shadows, and consistent rounded corners (`rounded-lg` or `rounded-xl`).
- Inputs and buttons should have readable labels, useful focus states, and comfortable tap targets.

## Merchant and admin pages

Keep management screens consistent with the storefront palette while prioritizing tables, forms, and clear actions. Use plain language for labels and helper text.

## Avoid

- Decorative gradients, oversized marketing copy, and unusual typography.
- Repeated floating badges, capsule-shaped toolbars, and nested cards.
- Low contrast text or using success colors for primary actions.
