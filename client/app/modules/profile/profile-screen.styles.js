import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 100, // Space for bottom tab bar
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },

  // Profile Card Styles
  profileCard: {
    backgroundColor: '#1E3A8A',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  coinBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: '#F59E0B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coinIcon: {
    fontSize: 20,
  },

  // Avatar and User Info
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  userLevel: {
    fontSize: 14,
    color: '#BFDBFE',
  },

  // Achievement Badges
  achievementContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  achievementBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  achievementBadge1: {
    backgroundColor: '#F59E0B',
  },
  achievementBadge2: {
    backgroundColor: '#10B981',
  },
  achievementBadge3: {
    backgroundColor: '#3B82F6',
  },
  achievementText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  achievementIcon: {
    fontSize: 14,
  },

  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#BFDBFE',
  },
  statPlaceholder: {
    width: 48,
    height: 48,
    backgroundColor: '#374151',
    borderRadius: 12,
  },

  // Menu Items
  menuContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  menuItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Logout Section
  logoutContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 16,
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  logoutText: {
    color: '#F59E0B',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
});
