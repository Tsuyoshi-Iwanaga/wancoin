import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, GitHubSourceCodeProvider, RedirectStatus } from '@aws-cdk/aws-amplify-alpha';

require('dotenv').config()
const token = process.env.REPOSITORYTOKEN || ''

export class Ec2CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //VPC
    const vpc = new ec2.Vpc(this, 'wancoin-vpc', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "wancoin-public-subnet",
          subnetType: ec2.SubnetType.PUBLIC
        }
      ],
      natGateways: 0,
    })

    //SG
    const sg = new ec2.SecurityGroup(this, "wancoin-public-sg", {
      vpc,
      securityGroupName: 'wancoin-public-sg',
      allowAllOutbound: true
    })

    //SSM role
    const role = new iam.Role(this, 'wancoin-ssm-role', {
      roleName: 'wancoin-ssm-role',
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyArn(this, "AmazonEC2ContainerServiceforEC2Role", "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"),
        //Add managed policy to use SSM
        iam.ManagedPolicy.fromManagedPolicyArn(this, "AmazonEC2RoleforSSM", "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM")
      ]
    })

    //AMI
    // const ami = new ec2.AmazonLinuxImage({
    //   generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2022,
    // })

    //EC2
    const ec2Instance = new ec2.Instance(this, 'wancoin-instance', {
      vpc,
      instanceName: 'wancoin-spot-instance',
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      machineImage: ec2.MachineImage.genericLinux({
        "ap-northeast-1": "ami-0e2bf1ada70fd3f33" //ubuntu 22.04 LTS
      }),
      securityGroup: sg,
      role
    })

    const launchTemplate = new ec2.LaunchTemplate(this, "wancoin-launch-template", {
      spotOptions: {}
    })

    ec2Instance.instance.launchTemplate = {
      version: launchTemplate.versionNumber,
      launchTemplateId: launchTemplate.launchTemplateId
    }

    //LoadBalancer
    // const lb_sg = new ec2.SecurityGroup(this, "wancoin-lb-sg", {
    //   vpc,
    //   securityGroupName: 'wancoin-lb-sg',
    //   allowAllOutbound: true
    // })

    // const lb = new ApplicationLoadBalancer(this, 'wancoin-lb', {
    //   vpc,
    //   internetFacing: true,
    //   http2Enabled: true,
    //   securityGroup: lb_sg,
    // });

    // const lb_listener = lb.addListener('wancoin-lb-listener', {
    //   port: 80,
    //   open: false,
    // })

    // lb_listener.addTargets('wancoin-lb-targets', {
    //   port: 3000,
    //   targets: []
    // })

    // //Amplify
    // const amplifyApp = new App(this, 'wancoin-amplify-app', {
    //   appName: 'wancoin-amplify-app',
    //   sourceCodeProvider: new GitHubSourceCodeProvider({
    //     owner: 'Tsuyoshi-Iwanaga',
    //     repository: 'wancoin',
    //     oauthToken: SecretValue.unsafePlainText(token)
    //   }),
    //   customRules: [
    //     {
    //       source: '/<*>',
    //       target: ' /index.html',
    //       status: RedirectStatus.NOT_FOUND_REWRITE,
    //     },
    //   ],
    //   environmentVariables: {
    //     AMPLIFY_MONOREPO_APP_ROOT: 'frontend',
    //     AMPLIFY_DIFF_DEPLOY: 'false'
    //   },
    //   autoBranchDeletion: true
    // })

    // //addBranch
    // amplifyApp.addBranch('main', {
    //   stage: 'PRODUCTION'
    // })
  }
}
