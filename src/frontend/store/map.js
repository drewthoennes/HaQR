let mapStateToProps = (state) => {
    return {
        store: {
            token: state.account.token
        }
    }
};

export default mapStateToProps;