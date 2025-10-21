export default {
	common: {
		signIn: 'ログイン',
		signUp: '新規登録',
		forgotPassword: 'パスワードをお忘れですか？',
		rememberMe: 'ログイン状態を保持',
		phoneNumber: '電話番号',
		password: 'パスワード',
		fullName: '氏名',
		confirmPassword: 'パスワードの確認',
		username: 'ユーザー名',
		email: 'メールアドレス',
		optional: '任意',
		ecosystem: 'は Local Place エコシステムの一部です'
	},
	signIn: {
		title: 'にログインして続行',
		subtitle: 'おかえりなさい！詳細を入力してください。',
		button: 'ログイン',
		noAccount: 'アカウントをお持ちでないですか？',
		signUpLink: '新規登録',
		phoneNumberPlaceholder: '電話番号を入力',
		passwordPlaceholder: 'パスワードを入力'
	},
	signUp: {
		title: 'アカウントを作成',
		titleSuffix: '',
		subtitle: '無料アカウントで始めましょう',
		button: 'アカウントを作成',
		hasAccount: 'すでにアカウントをお持ちですか？',
		signInLink: 'ログイン',
		fullNamePlaceholder: '氏名を入力',
		usernamePlaceholder: 'ユーザー名を入力',
		emailPlaceholder: 'メールアドレスを入力',
		phoneNumberPlaceholder: '電話番号を入力',
		passwordPlaceholder: 'パスワードを作成',
		confirmPasswordPlaceholder: 'パスワードを確認',
		usernameMinLength: 'ユーザー名は3文字以上である必要があります',
		usernameAvailable: 'ユーザー名は利用可能です',
		usernameTaken: 'このユーザー名は既に使用されています'
	},
	forgotPassword: {
		title: 'パスワードをリセット',
		subtitle: 'メールアドレスを入力すると、パスワードリセットの手順をお送りします',
		button: 'リセット手順を送信',
		rememberPassword: 'パスワードを思い出しましたか？',
		signInLink: 'ログイン',
		emailPlaceholder: 'メールアドレスを入力',
		successMessage: 'パスワードリセットリンクがメールアドレスに送信されました'
	},
	resetPassword: {
		title: '新しいパスワードを作成',
		subtitle: '新しいパスワードを入力してください',
		button: 'パスワードをリセット',
		submitting: 'リセット中...',
		passwordPlaceholder: '新しいパスワードを入力',
		confirmPasswordPlaceholder: '新しいパスワードを確認',
		redirecting: 'ログインページにリダイレクトしています...',
		backToSignIn: '戻る',
		linkExpiresIn: 'リンクの有効期限'
	},
	error: {
		title: 'アクセスが許可されていません',
		description: 'このページへのアクセスは制限されています。',
		warning: 'このページには有効な origin パラメータが必要です。適切なチャネルからこのページにアクセスしてください。',
		goHome: 'ホームに戻る',
		invalidCredentials: '電話番号またはパスワードが間違っています',
		invalidPhoneOrPassword: '電話番号またはパスワードが無効です',
		phoneAlreadyRegistered: 'この電話番号は既に登録されています',
		emailAlreadyRegistered: 'このメールアドレスは既に登録されています',
		usernameAlreadyTaken: 'このユーザー名は既に使用されています',
		registrationFailed: '登録に失敗しました。もう一度お試しください',
		emailNotFound: 'メールアドレスが見つかりません',
		forgotPasswordFailed: 'リセット手順の送信に失敗しました。もう一度お試しください',
		tokenExpired: 'リセットリンクが無効または期限切れです',
		passwordResetFailed: 'パスワードのリセットに失敗しました。もう一度お試しください'
	}
};
