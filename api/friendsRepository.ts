


export const FriendsRepository = {
  blockFriend: async (friendId: string, block: boolean) => {
    // implementation
  },
  addFriend: async (userId: string) => {
    // implementation
  },
  deleteFriend: async (friendId: string) => {
    // TODO: Replace with real API call
    // Example:
    // return await api.delete(`/friends/${friendId}`);
    return Promise.resolve({ data: { id: friendId } });
  }
};
