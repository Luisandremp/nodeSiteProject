module.exports = function (user) {
    const exportableUser = {id: user.id, name: user.name, email: user.email, isAdmin: user.admin };
    return exportableUser;
  }

