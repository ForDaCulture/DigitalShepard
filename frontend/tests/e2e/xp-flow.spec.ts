import { test, expect } from '@playwright/test';

test.describe('XP and Gamification Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from a clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows loading skeletons while fetching data', async ({ page }) => {
    await page.goto('/threats');
    
    // Check for loading skeletons
    await expect(page.locator('[data-testid="threat-skeleton"]')).toBeVisible();
    await expect(page.locator('[data-testid="xp-bar-skeleton"]')).toBeVisible();
    
    // Wait for content to load
    await expect(page.locator('[data-testid="threat-card"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="xp-progress"]')).toBeVisible();
  });

  test('displays XP progress and updates on threat detection', async ({ page }) => {
    await page.goto('/threats');
    
    // Get initial XP
    const initialXP = await page.locator('[data-testid="total-xp"]').textContent();
    expect(initialXP).toBe('0 XP');

    // Trigger a threat detection (simulating API response)
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('threatDetected', {
        detail: { type: 'phishing', severity: 'high' }
      }));
    });

    // Check for XP increase
    await expect(page.locator('[data-testid="total-xp"]')).not.toHaveText('0 XP');
    
    // Verify toast notification
    await expect(page.locator('role=alert')).toContainText('Threat Detected');
  });

  test('unlocks badge after meeting requirements', async ({ page }) => {
    await page.goto('/achievements');
    
    // Initial state - no badges
    await expect(page.locator('[data-testid="empty-achievements"]')).toBeVisible();

    // Simulate multiple threat detections
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('threatDetected', {
          detail: { type: 'phishing', severity: 'high' }
        }));
      });
      // Wait for XP update
      await page.waitForTimeout(500);
    }

    // Check for badge unlock
    await expect(page.locator('[data-testid="badge-phish-fighter"]')).toBeVisible();
    
    // Verify confetti animation
    await expect(page.locator('canvas#confetti')).toBeVisible();
    
    // Check toast notification
    await expect(page.locator('role=alert')).toContainText('Badge Unlocked');
  });

  test('shows level up animation', async ({ page }) => {
    await page.goto('/threats');
    
    // Simulate enough XP gain for level up
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('xpGained', {
        detail: { amount: 100 }
      }));
    });

    // Check for level up animation
    await expect(page.locator('canvas#confetti')).toBeVisible();
    await expect(page.locator('role=alert')).toContainText('Level Up');
    
    // Verify new level
    await expect(page.locator('[data-testid="user-level"]')).toContainText('Level 2');
  });

  test('persists progress across sessions', async ({ page }) => {
    await page.goto('/threats');
    
    // Gain some XP
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('xpGained', {
        detail: { amount: 50 }
      }));
    });
    
    // Get current XP
    const currentXP = await page.locator('[data-testid="total-xp"]').textContent();
    
    // Reload page
    await page.reload();
    
    // Verify XP persists
    await expect(page.locator('[data-testid="total-xp"]')).toHaveText(currentXP);
  });
}); 