import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Gold Embroidered Three Piece',
    category: 'Three Piece',
    price: 3500,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1620805151564-96696b00b0d3?auto=format&fit=crop&q=80&w=800',
    description: 'An exquisitely crafted three-piece suit featuring premium fabric and intricate gold embroidery. Perfect for elegant occasions.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Deep Red', 'Emerald Green'],
    reviews: [
      { id: 'r1', user: 'Faiza Rahman', rating: 5, comment: 'Absolutely gorgeous! The quality is premium indeed.' },
      { id: 'r2', user: 'Nadia S.', rating: 4, comment: 'Beautiful design, fits perfectly.' }
    ]
  },
  {
    id: '2',
    name: 'Premium Dubai Cherry Modest Burqa',
    category: 'Burqa',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1621570163351-46abcc8180c4?auto=format&fit=crop&q=80&w=800',
    description: 'A deeply elegant closed burqa made from authentic Dubai Cherry fabric. Features subtle stone work and absolute comfort.',
    sizes: ['52', '54', '56', '58'],
    colors: ['Black', 'Navy Blue', 'Mocha'],
    reviews: [
      { id: 'r3', user: 'Tahmina Islam', rating: 5, comment: 'The fabric is so soft and flows beautifully. Highly recommended.' }
    ]
  },
  {
    id: '3',
    name: 'Classic Signature Gents T-Shirt',
    category: 'Gents T-Shirt',
    price: 850,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    description: 'Minimalist luxury. A pure cotton, breathable t-shirt featuring the subtle ARAN STITCH gold emblem.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Charcoal'],
    reviews: [
      { id: 'r4', user: 'Rafi Ahmed', rating: 5, comment: 'Perfect fit. Black is super dark and holds nicely after wash.' },
      { id: 'r5', user: 'Anisur', rating: 4, comment: 'Very comfortable everyday wear.' }
    ]
  },
  {
    id: '4',
    name: 'Crystal Embellished Black Three Piece',
    category: 'Three Piece',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    description: 'A striking black canvas adorned with delicate crystals. Tailored to perfection for a commanding fashion statement.',
    sizes: ['L', 'XL', 'XXL'],
    colors: ['Black', 'Gold/Black'],
    reviews: []
  }
];

export const faqs = [
  {
    question: 'What are the delivery charges?',
    answer: 'Inside Dhaka city the delivery charge is 60 BDT. For areas outside Dhaka city, the charge is 120 BDT.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Inside city deliveries typically take 1-2 business days. Outside city may take 3-5 business days.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We currently accept secure mobile banking payments via bKash, Nagad, and Rocket before order confirmation.'
  },
  {
    question: 'Can I return an item?',
    answer: 'Yes, if there is a defect or size mismatch, please let the delivery personnel know or contact us within 24 hours of receiving the product.'
  }
];
