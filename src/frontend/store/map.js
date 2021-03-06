let mapStateToProps = (state) => {
    return {
        store: {
            token: state.account.token,
            config: state.account.config,
            account: state.account.account,
            hackers: state.account.hackers,
            users: state.account.users,
            roles: state.account.roles,
            interactions: state.account.interactions,
            loaded: state.account.loaded
        }
    }
};

export default mapStateToProps;
