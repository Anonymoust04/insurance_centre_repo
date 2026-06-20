import { IconShield, IconBrandLinkedin, IconBrandTwitter, IconBrandFacebook } from '@tabler/icons-react';
import { Container } from '@/components/ui/Container';
import { footerSections, contactDetails } from '@/data/insurance';

const socials = [
  { Icon: IconBrandLinkedin, href: '#', label: 'LinkedIn' },
  { Icon: IconBrandTwitter, href: '#', label: 'Twitter' },
  { Icon: IconBrandFacebook, href: '#', label: 'Facebook' },
] as const;

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <IconShield size={17} className="text-white" />
              </div>
              <span className="font-bold text-white text-base">
                SecureLife <span className="text-blue-400">Insurance</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Helping individuals and families build a secure financial future through trusted insurance and long-term planning.
            </p>
            <div className="space-y-2 mb-6">
              {contactDetails.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm">
                  <Icon size={15} className="text-blue-400 shrink-0" />
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
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-slate-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 SecureLife Insurance. All rights reserved.</p>
          <div className="flex gap-5">
            {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map((label) => (
              <a key={label} href="#" className="hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
