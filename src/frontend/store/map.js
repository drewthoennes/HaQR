let mapStateToProps = (state) => {
    return {
        store: {
            token: state.account.token,
            hackers: state.account.hackers,
            users: state.account.users
        }
    }
};

export default mapStateToProps;