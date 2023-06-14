"""empty message

Revision ID: 17b1d3bd961b
Revises: None
Create Date: 2023-06-09 15:02:21.379318

"""

# revision identifiers, used by Alembic.
revision = '17b1d3bd961b'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    print("upgrade")
    # # create user table
    op.create_table('user',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=80), nullable=True),
        sa.Column('password', sa.LargeBinary(), nullable=True),
        sa.Column('email', sa.String(length=120), nullable=True),
        sa.Column('first_name', sa.String(length=30), nullable=True),
        sa.Column('middle_name', sa.String(length=30), nullable=True),
        sa.Column('last_name', sa.String(length=30), nullable=True),
        sa.Column('static_roles', sa.Integer(), nullable=True),
        sa.Column('mobile_no', sa.String(length=30)),
        sa.Column('is_2fa', sa.Boolean()),
        sa.Column('is_csrf_token', sa.Boolean()),
        sa.Column('user_type', sa.String(length=30)),
        sa.Column('status', sa.String(length=50)),
        sa.Column('external_crm_uuid', sa.String(length=50), nullable=True),
        sa.Column('contact_type', sa.String(length=50), nullable=True),
        sa.Column('customer_reg_code', sa.String(length=50)),
        sa.Column('user_id', sa.String(length=50)),
        sa.PrimaryKeyConstraint('id', name='pk_user'),
        sa.UniqueConstraint('email', name='uq_user_email'),
        sa.UniqueConstraint('external_crm_uuid', name='uq_user_external_crm_uuid'),
        sa.UniqueConstraint('username', name='uq_user_username')
    )


    # create organisation table
    op.create_table('organisation',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=True),
        sa.Column('description', sa.String(length=1000)),
        sa.Column('org_reg_code', sa.String(length=50), nullable=True),
        sa.Column('org_id', sa.String(length=50), nullable=True),
        sa.Column('org_reg_code_generated_from', sa.Integer()),
        sa.Column('type', sa.String(length=50)),
        sa.PrimaryKeyConstraint('id', name='pk_organisation'),
        sa.UniqueConstraint('org_id', name='uq_organisation_org_id'),
        sa.UniqueConstraint('org_reg_code', name='uq_organisation_org_reg_code')
    )


    # create oauth2_admin_token table
    TokenTypes = sa.Enum('admintokentypes', name='token_types_enum')
    op.create_table('oauth2_admin_token',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.String(length=40), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('token_type', TokenTypes, nullable=True),
        sa.Column('access_token', sa.String(length=255), nullable=True),
        sa.Column('refresh_token', sa.String(length=255), nullable=True),
        sa.Column('expires', sa.TIMESTAMP(timezone=False), nullable=True),
        sa.Column('scopes', sa.JSON(), nullable=True),  # Set nullable=True
        sa.PrimaryKeyConstraint('id', name='pk_oauth2_admin_token'),
        sa.UniqueConstraint('access_token', name='uq_oauth2_admin_token_access_token'),
        sa.UniqueConstraint('refresh_token', name='uq_oauth2_admin_token_refresh_token')
    )

    op.create_index('ix_oauth2_admin_token_client_id', 'oauth2_admin_token', ['client_id'], unique=False)
    op.create_index('ix_oauth2_admin_token_user_id', 'oauth2_admin_token', ['user_id'], unique=False)


    # create admin_audit_trail_log table
    op.create_table(
        'admin_audit_trail_log',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('user_name', sa.String(length=100), nullable=True),
        sa.Column('organisation_id', sa.Integer(), nullable=True),
        sa.Column('organisation_name', sa.String(length=100), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('project_name', sa.String(length=100), nullable=True),
        sa.Column('provider_id', sa.Integer(), nullable=True),
        sa.Column('provider_name', sa.String(length=100), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=True),
        sa.Column('action_url', sa.String(length=100), nullable=True),
        sa.Column('action_method', sa.String(length=100), nullable=True),
        sa.Column('status', sa.String(length=100), nullable=True),
        sa.Column('status_message', sa.String(length=100), nullable=True),
        sa.Column('ref_task_id', sa.String(length=100), nullable=True),
        sa.Column('session_uuid', sa.String(length=100), nullable=True),
        sa.Column('resource_id', sa.Integer(), nullable=True),
        sa.Column('resource_type', sa.String(length=200), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('resource_name', sa.String(length=200), nullable=True),
        sa.Column('api_parameters', sa.Text(), nullable=True),
        sa.Column('origin', sa.String(length=100), nullable=True),
        sa.Column('x_real_ip', sa.String(length=15), nullable=True),
        sa.PrimaryKeyConstraint('id', name='pk_admin_audit_trail_log')
    )


    # create user_roles table
    op.create_table(
        'user_roles',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('user_scope', sa.Text(), nullable=True),
        sa.Column('user_role', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id', name='pk_user_roles')
    )

    op.create_index('ix_user_roles_user_id', 'user_roles', ['user_id'], unique=False)


    # create user_default_scope table
    op.create_table(
        'user_default_scope',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_scope_type', sa.String(length=50), nullable=True),
        sa.Column('scope', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id', name='pk_user_default_scope')
    )

    op.create_table(
        'resource_action_log',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('resource_type', sa.String(length=100), nullable=True),
        sa.Column('resource_record_id', sa.Integer(), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=True),
        sa.Column('resource_configuration', sa.String(length=500), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('organisation_id', sa.Integer(), nullable=True),
        sa.Column('provider_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id', name='pk_resource_action_log')
    )

    op.create_table(
        'role_permission_group',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('group_name', sa.String(length=50), nullable=False),
        sa.Column('group_description', sa.String(length=200), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=True),
        sa.Column('scope', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('public', sa.Boolean(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True),
        sa.Column('role_type', sa.String(length=50), nullable=True),
        sa.PrimaryKeyConstraint('id', name='pk_role_permission_group'))



    # create subscription table
    op.create_table(
        'subscription',
        sa.Column('created', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=True),
        sa.Column('provider_id', sa.Integer(), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('eula_id', sa.Integer(), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'))


    # create eula table
    op.create_table('eula',
                    sa.Column('created', sa.DateTime(), nullable=False),
                    sa.Column('updated', sa.DateTime(), nullable=False),
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('version', sa.String(length=10), nullable=False),
                    sa.Column('content', sa.Text, nullable=False),
                    sa.Column('status', sa.String(length=32), server_default='Active', nullable=True),
                    sa.PrimaryKeyConstraint('id', name=op.f('pk_eula')))


    # create organisation_project_user table
    op.create_table('organisation_project_user',
                    sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
                    sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=True),
                    sa.Column('project_id', sa.Integer(), nullable=True),
                    sa.Column('organisation_id', sa.Integer(), nullable=False),
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.PrimaryKeyConstraint('id', name='pk_organisation_project_user'))


    # create oauth2_client table
    ClientTypes = sa.Enum('public', 'confidential', name='clienttypes')
    op.create_table('oauth2_client',
                    sa.Column('client_id', sa.String(length=40), nullable=False),
                    sa.Column('client_secret', sa.LargeBinary(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('client_type', ClientTypes, nullable=False),
                    sa.Column('redirect_uris', sa.Text(), nullable=True),
                    sa.Column('default_scopes', sa.Text(), nullable=True),
                    sa.PrimaryKeyConstraint('client_id', name='pk_oauth2_client')
                    )

    op.create_index('ix_oauth2_client_user_id', 'oauth2_client', ['user_id'], unique=False)


    # create provider table
    op.create_table(
        'provider',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('provider_name', sa.String(length=120), nullable=True),
        sa.Column('provider_type_id', sa.Integer(), nullable=True),
        sa.Column('auth_url', sa.String(length=120), nullable=True),
        sa.Column('identity_api_version', sa.Integer(), nullable=True),
        sa.Column('username', sa.String(length=80), nullable=True),
        sa.Column('password', sa.String(length=80), nullable=True),
        sa.Column('region_name', sa.String(length=80)),
        sa.Column('project_name', sa.String(length=80)),
        sa.Column('user_domain_id', sa.String(length=80)),
        sa.Column('docker_registry', sa.String(length=80)),
        sa.Column('provider_description', sa.String(length=500)),
        sa.Column('provider_location', sa.String(length=50)),
        sa.Column('provider_id', sa.String(length=120)),
        sa.Column('is_active', sa.Boolean()),
        sa.Column('public', sa.Boolean()),
        sa.Column('status', sa.String(length=50)),
        sa.Column('cloud_init_script_location', sa.String(length=500)),
        sa.Column('cloud_init_script_full_path', sa.String(length=500)),
        sa.Column('is_sso_enabled', sa.Boolean()),
        sa.Column('idp_name', sa.String(length=80)),
        sa.Column('default', sa.Boolean()),
        sa.PrimaryKeyConstraint('id', name='pk_provider'),
        sa.UniqueConstraint('auth_url', name='uq_provider_auth_url'),
        sa.UniqueConstraint('provider_id', name='uq_provider_provider_id'),
        sa.UniqueConstraint('provider_name', name='uq_provider_provider_name'))


    # create provider_type table
    op.create_table(
        'provider_type',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('description', sa.String(length=120)),
        sa.PrimaryKeyConstraint('id', name='pk_provider_type'),
        sa.UniqueConstraint('name', name='uq_provider_type_name')
    )


    # create quotapackage table
    op.create_table(
        'quotapackage',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=200), nullable=False),
        sa.Column('quotapackage_value', sa.Integer()),
        sa.Column('user', sa.Integer()),
        sa.Column('project', sa.Integer()),
        sa.Column('vm', sa.Integer()),
        sa.Column('vcpu', sa.Integer()),
        sa.Column('ram', sa.Integer()),
        sa.Column('storage', sa.Integer()),
        sa.Column('network', sa.Integer()),
        sa.Column('subnet', sa.Integer()),
        sa.Column('port', sa.Integer()),
        sa.Column('router', sa.Integer()),
        sa.Column('security_group', sa.Integer()),
        sa.Column('security_group_rule', sa.Integer()),
        sa.Column('load_balancer', sa.Integer()),
        sa.Column('vm_snapshot', sa.Integer()),
        sa.Column('volume_snapshot', sa.Integer()),
        sa.Column('key_pair', sa.Integer()),
        sa.Column('floating_ip', sa.Integer()),
        sa.Column('public_ip', sa.Integer()),
        sa.Column('scaling_group', sa.Integer()),
        sa.Column('nks_cluster', sa.Integer()),
        sa.Column('nas_storage', sa.Integer()),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('version', sa.String(length=10), nullable=False, default='v1'),
        sa.Column('effective_from', sa.TIMESTAMP(timezone=False)),
        sa.Column('valid_till', sa.TIMESTAMP(timezone=False)),
        sa.Column('default', sa.Boolean()),
        sa.Column('object_storage', sa.Integer()),
        sa.Column('buckets', sa.Integer()),
        sa.PrimaryKeyConstraint('id', name='pk_quotapackage')
    )


    # create resource_availability_zones table
    op.create_table(
        'resource_availability_zones',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('provider_id', sa.Integer()),
        sa.Column('resource_name', sa.String(length=120), nullable=False),
        sa.Column('zone_name', sa.String(length=120), nullable=False),
        sa.Column('status', sa.String(length=50)),
        sa.Column('is_public', sa.Boolean()),
        sa.Column('is_default', sa.Boolean()),
        sa.PrimaryKeyConstraint('id', name='pk_resource_availability_zones'),
    )


    # create organisation_quotapackage table
    op.create_table(
        'organisation_quotapackage',
        sa.Column('created', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(timezone=False), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('organisation_id', sa.Integer(), nullable=False),
        sa.Column('quotapackage_id', sa.Integer(), nullable=False),
        sa.Column('provider_id', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id', name='pk_organisation_quotapackage'),
    )


    # # create oauth2_token table
    op.create_table(
        'oauth2_token',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('client_id', sa.String(length=40), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('token_type', sa.String(), nullable=True),
        sa.Column('access_token', sa.String(length=255), nullable=True),
        sa.Column('refresh_token', sa.String(length=255), nullable=True),
        sa.Column('expires', sa.TIMESTAMP(), nullable=True),
        sa.Column('scopes', sa.Text(), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('access_token', name='uq_oauth2_token_access_token'),
        sa.UniqueConstraint('refresh_token', name='uq_oauth2_token_refresh_token'))


    # create oauth2_grant table
    op.create_table(
        'oauth2_grant',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('client_id', sa.String(length=40), nullable=True),
        sa.Column('code', sa.String(length=255), nullable=True),
        sa.Column('redirect_uri', sa.String(length=255), nullable=True),
        sa.Column('expires', sa.TIMESTAMP(), nullable=True),
        sa.Column('scopes', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'))
    op.create_index('ix_oauth2_grant_client_id', 'oauth2_grant', ['client_id'], unique=True)
    op.create_index('ix_oauth2_grant_code', 'oauth2_grant', ['code'], unique=True)
    op.create_index('ix_oauth2_grant_user_id', 'oauth2_grant', ['user_id'], unique=True)



    # create audit_trail
    op.create_table(
        'audit_trail',
        sa.Column('created', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('ip_address', sa.String(length=100), nullable=True),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('user_name', sa.String(length=100), nullable=True),
        sa.Column('action_type', sa.String(length=100), nullable=True),
        sa.Column('message', sa.String(length=1000), nullable=True),
        sa.Column('request_url', sa.String(length=400), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        schema='public'
    )


    # create audit_trail_log
    op.create_table(
        'audit_trail_log',
        sa.Column('created', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        sa.Column('user_name', sa.String(length=100), nullable=True),
        sa.Column('organisation_id', sa.Integer(), nullable=True),
        sa.Column('organisation_name', sa.String(length=100), nullable=True),
        sa.Column('project_id', sa.Integer(), nullable=True),
        sa.Column('project_name', sa.String(length=100), nullable=True),
        sa.Column('provider_id', sa.Integer(), nullable=True),
        sa.Column('provider_name', sa.String(length=100), nullable=True),
        sa.Column('action', sa.String(length=100), nullable=True),
        sa.Column('action_url', sa.String(length=100), nullable=True),
        sa.Column('action_method', sa.String(length=100), nullable=True),
        sa.Column('status', sa.String(length=100), nullable=True),
        sa.Column('status_message', sa.String(length=100), nullable=True),
        sa.Column('ref_task_id', sa.String(length=100), nullable=True),
        sa.Column('session_uuid', sa.String(length=100), nullable=True),
        sa.Column('resource_id', sa.Integer(), nullable=True),
        sa.Column('resource_type', sa.String(length=200), nullable=True),
        sa.Column('error_message', sa.Text(), nullable=True),
        sa.Column('resource_name', sa.String(length=200), nullable=True),
        sa.Column('api_parameters', sa.Text(), nullable=True),
        sa.Column('origin', sa.String(length=100), nullable=True),
        sa.Column('x_real_ip', sa.String(length=15), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        schema='public'
    )


    # create regions
    op.create_table(
        'regions',
        sa.Column('created', sa.TIMESTAMP(), nullable=False),
        sa.Column('updated', sa.TIMESTAMP(), nullable=False),
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('region', sa.String(length=100), nullable=True),
        sa.Column('region_url', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )





def downgrade():
    print("downgrade")
    #drop user table
    op.drop_table('user')


    # drop organisation table
    op.drop_table('organisation')


    # drop oauth2_admin_token table
    op.drop_index('ix_oauth2_admin_token_client_id', 'oauth2_admin_token')
    op.drop_index('ix_oauth2_admin_token_user_id', 'oauth2_admin_token')
    op.drop_table('oauth2_admin_token')

    op.execute("DROP TYPE IF EXISTS token_types_enum")


    # drop admin_audit_trail_log table
    op.drop_table('admin_audit_trail_log')


    # drop user_roles table
    op.drop_table('user_roles')


    # drop user_default_scope table
    op.drop_table('user_default_scope')


    # drop resource_action_log table
    op.drop_table('resource_action_log')


    # drop role_permission_group table
    op.drop_table('role_permission_group')


    # drop subscription table
    op.drop_table('subscription')


    # drop eula table
    op.drop_table('eula')


    # drop organisation_project_user table
    op.drop_table('organisation_project_user')


    # drop oauth2_client table
    op.drop_index('ix_oauth2_client_user_id', 'oauth2_client')
    op.drop_table('oauth2_client')

    op.execute("DROP TYPE IF EXISTS clienttypes")


    # drop provider table
    op.drop_table('provider')


    # drop provider_type table
    op.drop_table('provider_type')


    # drop quotapackage table
    op.drop_table('quotapackage')


    # drop resource_availability_zones table
    op.drop_table('resource_availability_zones')


    # drop organisation_quotapackage table
    op.drop_table('organisation_quotapackage')


    # drop oauth2_token table
    op.drop_table('oauth2_token', schema='public')


    # drop oauth2_grant table
    op.drop_index('ix_oauth2_grant_user_id', table_name='oauth2_grant')
    op.drop_index('ix_oauth2_grant_code', table_name='oauth2_grant')
    op.drop_index('ix_oauth2_grant_client_id', table_name='oauth2_grant')
    op.drop_table('oauth2_grant', schema='public')


    # drop audit_trail
    op.drop_table('audit_trail', schema='public')


    # drop audit_trail_log
    op.drop_table('audit_trail_log', schema='public')


    # drop regions
    op.drop_table('regions')