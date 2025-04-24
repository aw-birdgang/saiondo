export const formatDate = (timestamp: FirebaseFirestore.Timestamp): string => {
    return timestamp.toDate().toISOString();
};

export const getCurrentTimestamp = (): FirebaseFirestore.Timestamp => {
    return FirebaseFirestore.Timestamp.now();
};
