import React from 'react';

import styles from './styles.module.scss';
import { useAuthContext } from '@/app/providers/Auth/AuthContext';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { ButtonBuy } from '@/components/ButtonBuy/ButtonBuy';
import { Icon } from '@/components/Icon';
import { apiProfile } from '@/api/profile';
import { useNotification } from './components/useNotification';
import { validation } from '@/shared/validation';
import { submitWithBackendErrors } from './helpers/submitWithBackendErrors';

export const ProfilePage: React.FC = () => {
  const { user, logout, checkAuth } = useAuthContext();

  const [nameNotification, setNameNotification] = useNotification();
  const [passwordNotification, setPasswordNotification] = useNotification();
  const [emailNotification, setEmailNotification] = useNotification();

  if (!user) {
    return;
  }

  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Profile</h2>
        <p>Manage your personal information and account settings</p>

        <div className={styles.formContainer}>
          <div className={styles.colomn1}>
            <Formik
              initialValues={{ firstName: user.firstName, lastName: user.lastName }}
              validateOnBlur={true}
              validateOnChange={false}
              validateOnMount={true}
              onSubmit={(values, formHelper) => {
                submitWithBackendErrors({
                  values,
                  request: apiProfile.changeName,
                  formHelper,
                  setNotification: setNameNotification,
                  onSuccess: () => {
                    checkAuth();
                  },
                });
              }}
            >
              {({ values, isSubmitting }) => {
                return (
                  <Form noValidate className={styles.form} action="">
                    <div className={styles.formInfo}>
                      <h3>Account information</h3>
                    </div>
                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="account:firstName">
                        First name
                      </label>
                      <Field
                        validate={validation.validateName}
                        type="text"
                        name="firstName"
                        id="account:firstName"
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className={styles.fieldError}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="account:lastName">
                        Last name
                      </label>
                      <Field
                        validate={validation.validateName}
                        type="text"
                        name="lastName"
                        id="account:lastName"
                        className={styles.input}
                      />
                      <ErrorMessage name="lastName" component="div" className={styles.fieldError} />
                    </div>

                    {nameNotification.error && (
                      <div className={styles.errorNotification}>{nameNotification.error}</div>
                    )}
                    {nameNotification.success && (
                      <div className={styles.successNotification}>{nameNotification.success}</div>
                    )}

                    <ButtonBuy
                      disabled={
                        values.firstName === user.firstName && values.lastName === user.lastName
                      }
                      isLoading={isSubmitting}
                      type="submit"
                      className={styles.button}
                      selected={false}
                      style={{ animation: 'none' }}
                    >
                      Save changes
                    </ButtonBuy>
                  </Form>
                );
              }}
            </Formik>

            <Formik
              validateOnBlur={true}
              validateOnChange={false}
              validateOnMount={true}
              initialValues={{ currentPassword: '', newEmail: '' }}
              onSubmit={(values, formHelper) => {
                submitWithBackendErrors({
                  values: { newEmail: values.newEmail, password: values.currentPassword },
                  request: apiProfile.changeEmail,
                  formHelper,
                  setNotification: setEmailNotification,
                  onSuccess: () => {
                    checkAuth();
                  },
                });
              }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form noValidate className={styles.form} action="">
                    <div className={styles.formInfo}>
                      <h3>Change email</h3>
                      <p>To change your email, enter your password and comfirm your new email.</p>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="changeEmailCurrentPassword">
                        Current password
                      </label>
                      <Field
                        type="password"
                        name="currentPassword"
                        id="changeEmailCurrentPassword"
                        placeholder="Enter current password"
                        validate={validation.validatePassword}
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className={styles.fieldError}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="changeEmailnewEmail">
                        New email
                      </label>
                      <Field
                        type="email"
                        name="newEmail"
                        id="changeEmailnewEmail"
                        placeholder="Enter new email"
                        validate={validation.validateEmail}
                        className={styles.input}
                      />
                      <ErrorMessage name="newEmail" component="div" className={styles.fieldError} />
                    </div>

                    {emailNotification.error && (
                      <div className={styles.errorNotification}>{emailNotification.error}</div>
                    )}
                    {emailNotification.success && (
                      <div className={styles.successNotification}>{emailNotification.success}</div>
                    )}
                    <div className={styles.warning}>
                      <Icon className={styles.iconWarning} type="warning"></Icon>A confirmation link
                      will be send to your new email.
                    </div>

                    <ButtonBuy
                      isLoading={isSubmitting}
                      type="submit"
                      className={styles.button}
                      selected={false}
                      style={{ animation: 'none' }}
                    >
                      Send comfirmation email
                    </ButtonBuy>
                  </Form>
                );
              }}
            </Formik>
          </div>

          <div className={styles.colomn2}>
            <Formik
              onSubmit={(values, formHelper) => {
                if (values.newPassword !== values.confirmNewPassword) {
                  formHelper.setErrors({
                    confirmNewPassword: 'Confirm new password is not correct',
                  });
                  return;
                }

                if (values.currentPassword === values.newPassword) {
                  formHelper.setErrors({
                    newPassword: 'New password must be different from current password',
                  });
                  return;
                }

                submitWithBackendErrors({
                  values: values,
                  request: apiProfile.changePassword,
                  formHelper,
                  setNotification: setPasswordNotification,
                  onSuccess: () => {
                    checkAuth();
                  },
                });
              }}
              initialValues={{ currentPassword: '', newPassword: '', confirmNewPassword: '' }}
            >
              {({ isSubmitting }) => {
                return (
                  <Form noValidate className={styles.form} action="">
                    <div className={styles.formInfo}>
                      <h3>Change password</h3>
                      <p>choose a strong password to keep your account secure.</p>
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="changePasswordCurrentPassword">
                        Current password
                      </label>
                      <Field
                        validate={validation.validatePassword}
                        type="password"
                        name="currentPassword"
                        id="changePasswordCurrentPassword"
                        placeholder="Enter current password"
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="currentPassword"
                        component="div"
                        className={styles.fieldError}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="changePasswordNewPassword">
                        New password
                      </label>
                      <Field
                        validate={validation.validatePassword}
                        type="password"
                        name="newPassword"
                        id="changePasswordNewPassword"
                        placeholder="Enter new password"
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="newPassword"
                        component="div"
                        className={styles.fieldError}
                      />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="changePasswordConfirmNewPassword">
                        Confirm new password
                      </label>
                      <Field
                        validate={validation.validatePassword}
                        type="password"
                        name="confirmNewPassword"
                        id="changePasswordConfirmNewPassword"
                        placeholder="Enter confirm new password"
                        className={styles.input}
                      />
                      <ErrorMessage
                        name="confirmNewPassword"
                        component="div"
                        className={styles.fieldError}
                      />
                    </div>
                    {passwordNotification.error && (
                      <div className={styles.errorNotification}>{passwordNotification.error}</div>
                    )}
                    {passwordNotification.success && (
                      <div className={styles.successNotification}>
                        {passwordNotification.success}
                      </div>
                    )}

                    <ButtonBuy
                      type="submit"
                      isLoading={isSubmitting}
                      className={styles.button}
                      selected={false}
                      style={{ animation: 'none' }}
                    >
                      Update password
                    </ButtonBuy>
                  </Form>
                );
              }}
            </Formik>
            <div className={styles.form}>
              <div className={styles.formInfo}>
                <h3>Account</h3>
                <p>Log out from your account on this device.</p>
              </div>

              <button className={styles.buttonLogout} onClick={() => logout()}>
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
