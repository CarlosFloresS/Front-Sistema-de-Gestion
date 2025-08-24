import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkMode = false;
  private readonly THEME_KEY = 'theme-preference';

  constructor(rendererFactory: RendererFactory2) {
    // Usamos Renderer2 para manipular el DOM de forma segura en Angular
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();
  }

  // Carga la preferencia guardada al iniciar la app
  private loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      if (this.isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
      }
    } else {
      // Opcional: detectar el tema preferido del sistema operativo
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (this.isDarkMode) {
        this.renderer.addClass(document.body, 'dark-mode');
        localStorage.setItem(this.THEME_KEY, 'dark');
      }
    }
  }

  // Cambia el tema
  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
      localStorage.setItem(this.THEME_KEY, 'dark');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
      localStorage.setItem(this.THEME_KEY, 'light');
    }
  }

  // Permite a los componentes saber cuál es el tema actual
  isDark(): boolean {
    return this.isDarkMode;
  }
}
