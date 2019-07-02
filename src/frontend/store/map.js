let mapStateToProps = (state) => {
    return {
        store: {
            token: state.account.token,
            account: state.account.account,
            hackers: state.account.hackers,
            users: state.account.users,
            loaded: state.account.loaded
        }
    }
};

export default mapStateToProps;