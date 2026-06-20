import { IconBolt, IconBrandLinkedin, IconBrandTwitter, IconBrandFacebook } from '@tabler/icons-react';
import { Container } from '@/components/ui/Container';
import { footerSections, contactDetails } from '@/data/insurance';

const socials = [
  { Icon: IconBrandLinkedin, href: '#', label: 'LinkedIn' },
  { Icon: IconBrandTwitter, href: '#', label: 'Twitter' },
  { Icon: IconBrandFacebook, href: '#', label: 'Facebook' },
] as const;

export function Footer() {
  return (
    <footer className="bg-card-cream text-card-text border-t-4 border-sketch font-sans relative overflow-hidden">
      <Container className="py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-pastel-pink border-sketch flex items-center justify-center shadow-sm transform -rotate-2">
                <IconBolt size={20} className="text-card-outline" />
              </div>
              <span className="font-handwriting font-bold text-card-outline text-3xl mt-1">
                Insurance <span className="text-pastel-pink drop-shadow-[1px_1px_0_var(--color-card-outline)]">Center</span>
              </span>
            </div>
            <p className="text-lg font-bold opacity-80 leading-relaxed mb-6 max-w-xs">
              Helping trainers build a secure future through trusted protection and long-term planning.
            </p>
            <div className="space-y-3 mb-6">
              {contactDetails.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-lg font-bold opacity-80">
                  <Icon size={18} className="text-pastel-pink shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-pastel-yellow border-sketch flex items-center justify-center hover:bg-pastel-pink transition-colors transform hover:-translate-y-1"
                >
                  <Icon size={20} className="text-card-outline" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-card-outline font-handwriting font-bold text-3xl mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-lg font-bold opacity-80 hover:opacity-100 hover:text-pastel-pink transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t-4 border-card-outline/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-bold opacity-70">
          <p>© 2026 Insurance Center. Built for fun!</p>
          <div className="flex gap-5">
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((label) => (
              <a key={label} href="#" className="hover:text-pastel-pink transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
