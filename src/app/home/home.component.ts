import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../service/auth.service'; // Ensure correct path for your setup
import { Observable, Subject } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { ethers } from 'ethers'; // Import ethers
import type { Provider } from 'ethers';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatButtonModule, MatDividerModule, 
    MatIconModule, MatToolbarModule,
    MatSidenavModule, RouterModule,
    RouterLink, RouterLinkActive,
    MatListModule, MatMenuModule,
    CommonModule
  ],
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit, OnDestroy {


  opened = false;
  currentUser$: Observable<User | null>;
  loading = false;
  private destroy$ = new Subject<void>();
  
  // Track visibility of the wallets submenu
  showWalletsSubmenu = false;
  isMetaMaskConnected = false;

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router // Add Router for navigation
  ) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit() {
    this.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (user) => {
        if (user) {
          // User is logged in with GitHub, check MetaMask status
          await this.checkAndConnectMetaMask();
        }
 
        // Force change detection to update menu items
        this.cdr.detectChanges();
      });
  }

  private async checkAndConnectMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Check if already connected to MetaMask
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length === 0) {
          // Not connected, trigger MetaMask login
          await this.integrateWithMetaMask();
        } else {
          // Already connected
          this.isMetaMaskConnected = true;
          console.log('Already connected to MetaMask:', accounts[0]);
        }
      } catch (error) {
        console.error('Error checking MetaMask status:', error);
      }
    } else {
      console.log('MetaMask is not installed');
    }
  }

  async login() {
    if (this.loading) return;

    try {
      this.loading = true;
      this.cdr.detectChanges(); // Force update of UI
      await this.authService.signInWithGithub();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // Ensure UI updates after loading completes
    }
  }

  async logout() {
    if (this.loading) return;

    try {
      this.loading = true;
      this.cdr.detectChanges(); // Force update of UI
      await this.authService.signOut();
      this.isMetaMaskConnected = false;
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges(); // Ensure UI updates after loading completes
    }
  }

  goToProfile() {
    console.log("in goToProfile method from home component")
    this.router.navigate(['/profile']).then(() => {
      // Close the menu after navigation
      if (this.opened) {
        this.opened = false;
      }
    });
  }

  goToSettings() {
    // Navigate to the settings page
    this.router.navigate(['/settings']);
  }

  goToActivity() {
    // Navigate to the activity page
    this.router.navigate(['/activity']);
  }

  goToSupport() {
    // Navigate to the support page
    this.router.navigate(['/support']);
  }

  
  

  signOutFromMetaMask() {
    // Logic to sign out from MetaMask
    this.isMetaMaskConnected = false;
    console.log('Signing out from MetaMask...');
    // Implement sign out logic here
  }

  async integrateWithMetaMask() {
    if (this.loading) return;

    try {
        this.loading = true;
        this.cdr.detectChanges();

        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            this.isMetaMaskConnected = true;
            console.log('Connected to MetaMask:', address);

            // You can now use the `signer` to interact with your smart contracts
        } else {
            console.error('MetaMask is not installed. Please install it.');
        }
    } catch (error) {
        console.error('MetaMask login failed:', error);
    } finally {
        this.loading = false;
        this.cdr.detectChanges();
    }
}

toggleWalletsSubmenu() {
  this.showWalletsSubmenu = !this.showWalletsSubmenu;
}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
