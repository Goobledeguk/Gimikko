import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#818cf8',
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 15,
    height: 48,
    borderWidth: 1,
    borderColor: '#334155',
  },
  addButton: {
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 10,
    height: 48,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 15,
  },
  taskCard: {
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  taskTouchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    fontSize: 18,
    color: '#6366f1',
    marginRight: 12,
    fontWeight: 'bold',
  },
  taskTitle: {
    color: '#f8fafc',
    fontSize: 15,
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: '#f43f5e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
});