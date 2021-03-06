var LoginView = soma.View.extend({
	message: null,
	username: null,
	password: null,
	login: null,
	init: function() {
		this.message = document.getElementById('message');
		this.username = document.getElementById('username');
		this.password = document.getElementById('password');
		this.login = document.getElementById('login');
		$(this.login).click(this.clickHandler.bind(this));
	},
	clickHandler: function(event){
		if (event.preventDefault) event.preventDefault();
		var vo = new LoginVO(this.username.value, this.password.value);
		this.dispatchEvent(new LoginEvent(LoginEvent.LOGIN, vo, "Please wait..."));
		return false;
	},
	showMessage: function(message) {
		this.message.style.color = "#000000";
		this.message.innerHTML = message;
	},
	showMessageError: function(message) {
		console.log("---------", message);
		this.message.style.color = "#FF0000";
		this.message.innerHTML = message;
	}
});
LoginView.NAME = "View::LoginView";

var EmployeeListView = soma.View.extend({
	logout: null,
	tableList: null,
	tableListContainer: null,
	create: null,
	init: function() {
		this.tableListContainer = document.getElementById('list-table-container');
		this.logout = document.getElementById('buttonLogoutList');
		$(this.logout).click(this.logoutClickHandler.bind(this));
		this.create = document.getElementById('buttonCreate');
		$(this.create).click(this.createClickHandler.bind(this));
	},
	logoutClickHandler: function(event){
		if (event.preventDefault) event.preventDefault();
		this.dispatchEvent(new LoginEvent(LoginEvent.LOGOUT));
	},
	createClickHandler: function(event){
		if (event.preventDefault) event.preventDefault();
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_DETAILS));
	},
	updateList: function(data) {
		var str = '<table cellpadding="0" cellspacing="0" border="0" width="100%" id="employee-list-table"><tr class="header"><th width="50%">Name</th><th>Age</th></tr>'
		for (var i = 0; i < data.length; i++) {
			str += '<tr class="row">';
			str += '<td style="display:none">' + data[i].id + '</td>' + '<td>' + data[i].name + '</td>' + '<td>' + data[i].age + '</td>';
			str += '</tr>';
		}
		str += '</table>';
		this.tableListContainer.innerHTML = str;
		this.tableList = document.getElementById('employee-list-table');

		// it is not possible without hacks to dispatch custom event from a DOM element with IE7 and IE8
		// the variable "self" keeps a reference to the view (soma.View) so an event can be dispatched from
		var self = this;
		$('.row').each(function(index, value) {
			$(this).click(function() {
				var vo = new EmployeeVO();
				vo.id = self.getNodeContent(this.childNodes[0]);
				vo.name = self.getNodeContent(this.childNodes[1]);
				vo.age = self.getNodeContent(this.childNodes[2]);
				self.dispatchEvent(new EmployeeEvent(EmployeeEvent.SELECT, vo));
				self.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_DETAILS));
			});
		});
	},
	getNodeContent: function(node) {
		return node.textContent ? node.textContent : node.innerText;
	}
});
EmployeeListView.NAME = "View::EmployeeListView";

var EmployeeEditView = soma.View.extend({
	employee:null,
	logout: null,
	cancel: null,
	submit: null,
	deleteEmployee: null,
	inputName: null,
	inputAge: null,
    shouldAutobind: true,
	init: function() {
		this.logout = document.getElementById('buttonLogoutEdit');
		$(this.logout).click(this.logoutClickHandler);
		this.cancel = document.getElementById('button-edit-cancel');
		$(this.cancel).click(this.cancelClickHandler);
		this.submit = document.getElementById('button-edit-submit');
		$(this.submit).click(this.submitClickHandler);
		this.deleteEmployee = document.getElementById('buttonDelete');
		$(this.deleteEmployee).click(this.deleteClickHandler);
		this.inputName = document.getElementById('employeeName');
		this.inputAge = document.getElementById('employeeAge');
	},
	logoutClickHandler: function(event){
		if (event.preventDefault) event.preventDefault();
		this.leaveForm();
		this.dispatchEvent(new LoginEvent(LoginEvent.LOGOUT));
		return false;
	},
	deleteClickHandler: function(event) {
		if (event.preventDefault) event.preventDefault();
		this.dispatchEvent(new EmployeeEvent(EmployeeEvent.DELETE, this.employee));
		this.leaveForm();
		return false;
	},
	cancelClickHandler: function(event) {
		if (event.preventDefault) event.preventDefault();
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_LIST));
		this.leaveForm();
		return false;
	},
	submitClickHandler: function(event) {
		if (event.preventDefault) event.preventDefault();
		if (this.employee == null) this.employee = new EmployeeVO();
		this.employee.name = this.inputName.value;
		this.employee.age = this.inputAge.value;
		if (this.employee.name == null || this.employee.name == "" || this.employee.age == null || this.employee.age == "") return;
		if (this.employee.id == null) {
			this.dispatchEvent(new EmployeeEvent(EmployeeEvent.CREATE, this.employee));
		}
		else {
			this.dispatchEvent(new EmployeeEvent(EmployeeEvent.EDIT, this.employee));
		}
		this.leaveForm();
		return false;
	},
	leaveForm:function() {
		this.dispatchEvent(new NavigationEvent(NavigationEvent.SELECT, NavigationConstants.EMPLOYEE_LIST));
		this.inputName.value = "";
		this.inputAge.value = "";
		this.employee = null;
	},
	updateFields: function(vo) {
		this.employee = vo;
		this.inputName.value = this.employee.name;
		this.inputAge.value = this.employee.age;
	}
});
EmployeeEditView.NAME = "View::EmployeeEditView";

