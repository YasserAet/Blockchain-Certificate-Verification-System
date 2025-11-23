export function Footer() {
  return (
    <footer className="bg-primary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-accent mb-4">Credential Chain</h3>
            <p className="text-foreground/60 text-sm">
              Blockchain-powered credential verification with AI-driven fraud detection.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-accent transition-smooth">Features</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Pricing</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-accent transition-smooth">About</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Blog</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-accent transition-smooth">Privacy</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Terms</a></li>
              <li><a href="#" className="hover:text-accent transition-smooth">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm">
            © 2025 Credential Chain. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-foreground/60 hover:text-accent transition-smooth">Twitter</a>
            <a href="#" className="text-foreground/60 hover:text-accent transition-smooth">GitHub</a>
            <a href="#" className="text-foreground/60 hover:text-accent transition-smooth">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
