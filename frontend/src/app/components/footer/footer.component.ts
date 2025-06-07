import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer mt-auto py-3 bg-white text-secondary">
      <div class="container text-center">
        <span>© Copyright © 2025 Crud Node.JS. | Powered by <a href="https://github.com/thebug13" target="_blank" rel="noopener noreferrer">Felipe Loaiza</a></span>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.css']
})
export class FooterComponent { } 