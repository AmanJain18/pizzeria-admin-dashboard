const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
        return 'Good Morning';
    } else if (currentHour < 17) {
        return 'Good Afternoon';
    } else if (currentHour < 20) {
        return 'Good Evening';
    } else {
        return 'Good Night';
    }
};

export default getGreeting;
