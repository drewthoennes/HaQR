let mapStateToProps = (state) => {
    return {
        account: {
            token: state.account.token
        }
    }
};

export default mapStateToProps;