# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

{
    'name': "Project Enterprise",
    'summary': """Bridge module for project and enterprise""",
    'description': """
Bridge module for project and enterprise
    """,
    'category': 'Services/Project',
    'version': '1.0',
    'depends': ['project', 'web_map', 'web_gantt'],
    'data': [
        'security/ir.model.access.csv',
        'views/res_config_settings_views.xml',
        'views/project_task_views.xml',
        'views/project_views.xml',
        'views/project_sharing_templates.xml',
        'views/project_sharing_views.xml',
        'report/project_report_views.xml',
        'wizard/task_confirm_schedule_wizard_views.xml',
    ],
    'demo': ['data/project_demo.xml'],
    'auto_install': True,
    'license': 'LGPL-3',
    'assets': {
        'web.assets_backend': [
            'project_enterprise/static/src/js/**/*',
            'project_enterprise/static/src/scss/**/*',
            'project_enterprise/static/src/components/**/*',
            'project_enterprise/static/src/**/*.xml',

            # Don't include dark mode files in light mode
            ('remove', 'project_enterprise/static/src/components/**/*.dark.scss'),
        ],
        "web.dark_mode_assets_backend": [
            'project_enterprise/static/src/components/**/*.dark.scss',
        ],
        'web.qunit_suite_tests': [
            'project_enterprise/static/tests/**/*',
        ],
        'project.webclient': [

            ('remove', 'project/static/src/project_sharing/main.js'),
            'project_enterprise/static/src/project_sharing/**/*',
        ],
        'web.assets_tests': [
            'project_enterprise/static/tests/tours/**/*',
        ],
    }
}
