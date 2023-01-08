import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

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
        /** Add managed policy to use SSM */
        iam.ManagedPolicy.fromManagedPolicyArn(this, "AmazonEC2RoleforSSM", "arn:aws:iam::aws:policy/service-role/AmazonEC2RoleforSSM")
      ]
    })

    //AMI
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2022,
    })

    const launchTemplate = new ec2.LaunchTemplate(this, "wancoin-launch-template", {
      spotOptions: {}
    })

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

    ec2Instance.instance.launchTemplate = {
      version: launchTemplate.versionNumber,
      launchTemplateId: launchTemplate.launchTemplateId
    }

    //Output
    new CfnOutput(this, "wancoin-instance-ip", {
      value: ec2Instance.instancePublicIp
    })
  }
}
